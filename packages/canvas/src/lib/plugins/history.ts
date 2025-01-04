import * as fabric from 'fabric';

import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { clone } from '@rekorder.io/utils';

import { findCanvasHistoryById, findCanvasObjectById } from '../utils/find-object-by-id';

type CanvasHistoryType = 'add' | 'remove' | 'modify' | 'erase';
interface CanvasHistory {
  id: string;
  target: fabric.FabricObject;
  state: fabric.FabricObject[];
  type: CanvasHistoryType;
}

class HistoryPlugin {
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

  private __handleHistoryEvent(event: fabric.ModifiedEvent<fabric.TPointerEvent>, type: CanvasHistoryType) {
    if (!this._canvas || !this._enabled) return;

    const object = event.target;
    this._undo.push({ id: object.id, target: clone(object), state: this.__currentState(), type });
    console.log(toJS(this._undo));
  }

  private __serializeState(state: fabric.FabricObject) {
    const cloned = clone(state);
    const { type, ...props } = cloned;
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

      default: {
        console.warn('Undo aborted: Unknown history type');
      }
    }

    this._canvas.requestRenderAll();
    runInAction(() => {
      this._redo.push({ id: history.id, target: history.target, type: history.type, state: current });
      this._enabled = true;
    });
  }

  async redo() {
    if (!this._redo.length || !this._canvas) return;

    runInAction(() => {
      this._enabled = false;
    });

    const history = this._redo.pop()!;
    const current = this.__currentState();

    switch (history.type) {
      case 'remove': {
        const object = findCanvasObjectById(this._canvas, history.id);
        if (object) this._canvas.remove(object);
        else console.warn('Redo aborted: Object does not exist');
        break;
      }

      case 'add': {
        const state = findCanvasHistoryById(history.id, history);
        if (state) {
          try {
            const objects = await fabric.util.enlivenObjects([state]);
            const object = objects.at(0) as fabric.FabricObject | undefined;

            if (object) this._canvas!.add(object);
            else console.warn('Redo aborted: Enlivened object does not exist');
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
          object.set(this.__serializeState(state));
          object.setCoords();
        }
        break;
      }

      default: {
        console.warn('Redo aborted: Unknown history type');
      }
    }

    this._canvas.requestRenderAll();
    runInAction(() => {
      this._undo.push({ id: history.id, target: history.target, type: history.type, state: current });
      this._enabled = true;
    });
  }

  flush() {
    this._undo = [];
    this._redo = [];
  }

  initialize(canvas: fabric.Canvas) {
    this._canvas = canvas;
    this.__setupEvents();
  }

  destroy() {
    this.flush();
    this.__removeEvents();
    this._canvas = null;
  }
}

export { HistoryPlugin, type CanvasHistory };
