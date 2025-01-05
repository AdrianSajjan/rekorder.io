import * as fabric from 'fabric';

import { ClippingGroup, EraserBrush, ErasingEvent } from '@erase2d/fabric';
import { clone } from '@rekorder.io/utils';
import { makeAutoObservable, runInAction } from 'mobx';

import { findCanvasHistoryById, findCanvasObjectById } from '../utils/find-object-by-id';

type ObjectHistoryAction = 'add' | 'remove' | 'modify';

type CanvasHistory = ObjectHistory | EraserHistory;

interface EraserHistory {
  detail: ErasingEvent<'end'>['detail'];
  commit: Map<fabric.FabricObject, fabric.Path>;
  state: fabric.FabricObject[];
  type: 'erase';
}

interface ObjectHistory {
  id: string;
  target: fabric.FabricObject;
  state: fabric.FabricObject[];
  type: ObjectHistoryAction;
}

class HistoryPlugin {
  private _eraser: EraserBrush | null = null;
  private _canvas: fabric.Canvas | null = null;

  private _undo: CanvasHistory[] = [];
  private _redo: CanvasHistory[] = [];

  private _enabled = true;
  private _disposables: VoidFunction[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new HistoryPlugin();
  }

  get canUndo() {
    return this._undo.length > 0;
  }

  get canRedo() {
    return this._redo.length > 0;
  }

  private __handleHistoryEvent(event: fabric.ModifiedEvent<fabric.TPointerEvent>, type: ObjectHistoryAction) {
    if (!this._enabled) return;

    const object = event.target;
    this._undo.push({ id: object.id, target: clone(object), state: this.__currentState(), type });
    this._redo = [];
  }

  private __serializeState(state: fabric.FabricObject) {
    const { type: _, ...props } = clone(state);
    return props;
  }

  private __currentState() {
    return this._canvas ? this._canvas._objects.map(clone) : [];
  }

  private __setupEvents() {
    if (this._canvas) {
      const add = this._canvas.on('object:added', (event) => this.__handleHistoryEvent(event, 'add'));
      const remove = this._canvas.on('object:removed', (event) => this.__handleHistoryEvent(event, 'remove'));
      const modify = this._canvas.on('object:modified', (event) => this.__handleHistoryEvent(event, 'modify'));
      this._disposables.push(add, remove, modify);
    }
  }

  private __removeEvents() {
    this._disposables.forEach((dispose) => dispose());
  }

  erased(detail: ErasingEvent<'end'>['detail'], commit: Map<fabric.FabricObject, fabric.Path>) {
    if (!this._enabled) return;
    this._undo.push({ detail, commit, state: this.__currentState(), type: 'erase' });
    this._redo = [];
  }

  async undo() {
    if (!this._undo.length || !this._canvas) return;

    runInAction(() => {
      this._enabled = false;
    });

    const history = this._undo.pop()!;
    const current = this.__currentState();
    const previous = this._undo.at(-1);

    switch (history.type) {
      case 'add': {
        const object = findCanvasObjectById(this._canvas, history.id);
        if (object) this._canvas.remove(object);
        else console.warn('Undo aborted: Object does not exist');
        break;
      }

      case 'remove': {
        const state = findCanvasHistoryById(history.id, previous);
        if (state) {
          try {
            const objects = await fabric.util.enlivenObjects([state]);
            const object = objects.at(0) as fabric.FabricObject | undefined;

            if (object) this._canvas!.add(object);
            else console.warn('Undo aborted: Enlivened object does not exist');
          } catch (error) {
            console.warn('Undo aborted: Failed to enliven objects', error);
          }
        }
        break;
      }

      case 'modify': {
        const object = findCanvasObjectById(this._canvas, history.id);
        const state = findCanvasHistoryById(history.id, previous);

        if (!object || !state) {
          console.warn("Undo aborted: Either object or state doesn't exist", object, state);
        } else {
          object.set(this.__serializeState(state));
          object.setCoords();
        }
        break;
      }

      case 'erase': {
        history.commit.forEach((_, object) => {
          if (object.clipPath instanceof ClippingGroup) {
            object.clipPath._objects = object.clipPath._objects.slice(0, -1);
            object.set({ clipPath: object.clipPath, dirty: true });
          }
        });
        break;
      }

      default: {
        console.warn('Undo aborted: Unknown history type');
      }
    }

    this._canvas.requestRenderAll();
    runInAction(() => {
      this._redo.push({ ...history, state: current });
      this._enabled = true;
    });
  }

  async redo() {
    if (!this._redo.length || !this._canvas || !this._eraser) return;

    runInAction(() => {
      this._enabled = false;
    });

    const history = this._redo.pop()!;
    const current = this.__currentState();

    switch (history.type) {
      case 'remove': {
        const object = findCanvasObjectById(this._canvas, history.id);

        if (object) {
          this._canvas.remove(object);
        } else {
          console.warn('Redo aborted: Object does not exist');
        }
        break;
      }

      case 'add': {
        const state = findCanvasHistoryById(history.id, history);
        if (state) {
          try {
            const objects = await fabric.util.enlivenObjects([state]);
            const object = objects.at(0) as fabric.FabricObject | undefined;

            if (object) {
              this._canvas!.add(object);
            } else {
              console.warn('Redo aborted: Enlivened object does not exist');
            }
          } catch (error) {
            console.warn('Redo aborted: Failed to enliven objects', error);
          }
        }
        break;
      }

      case 'modify': {
        const object = findCanvasObjectById(this._canvas, history.id);
        const state = findCanvasHistoryById(history.id, history);

        if (!object || !state) {
          console.warn("Redo aborted: Either object or state doesn't exist");
        } else {
          try {
            object.set(this.__serializeState(state));
            object.setCoords();
            if (state.clipPath) {
              const [clipPath] = await fabric.util.enlivenObjects([state.clipPath]);
              object.set({ clipPath });
            }
          } catch (error) {
            console.warn('Redo aborted: Failed to enliven objects', error);
          }
        }
        break;
      }

      case 'erase': {
        await this._eraser.commit(history.detail);
        break;
      }

      default: {
        console.warn('Redo aborted: Unknown history type');
      }
    }

    this._canvas.requestRenderAll();
    runInAction(() => {
      this._undo.push({ ...history, state: current });
      this._enabled = true;
    });
  }

  flush() {
    this._undo = [];
    this._redo = [];
  }

  initialize(canvas: fabric.Canvas, eraser: EraserBrush) {
    this._canvas = canvas;
    this._eraser = eraser;
    this.__setupEvents();
  }

  destroy() {
    this.flush();
    this.__removeEvents();
    this._canvas = null;
  }
}

export { HistoryPlugin, type CanvasHistory };
