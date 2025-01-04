import * as fabric from 'fabric';
import { EraserBrush } from '@erase2d/fabric';

import { makeAutoObservable } from 'mobx';
import { throttle } from 'lodash';
import { theme } from '@rekorder.io/ui';

import { measureElement } from '../lib/utils';

type EditorMode = 'pencil' | 'highlighter' | 'eraser' | 'shape' | 'line' | 'text' | 'select';

type ShapeMode = 'rectangle' | 'circle' | 'triangle';

type LineMode = 'line' | 'arrow' | 'dashed' | 'dotted';

class Editor {
  canvas: fabric.Canvas | null;
  workspace: HTMLDivElement | null;

  color: string;
  fill: boolean;
  width: number;

  line: LineMode;
  shape: ShapeMode;
  mode: EditorMode;
  scrollSync: boolean;

  private _eraser: EraserBrush | null = null;
  private _observer: ResizeObserver | null = null;
  private _pencil: fabric.PencilBrush | null = null;

  private _lastScrollY = 0;
  private _disposables: VoidFunction[] = [];

  private _drawnShape: fabric.FabricObject | null = null;
  private _originPointer: Pick<DOMPoint, 'x' | 'y'> | null = null;

  constructor() {
    this.canvas = null;
    this.workspace = null;
    this.scrollSync = true;

    this.width = 10;
    this.fill = false;
    this.mode = 'pencil';
    this.color = '#000000';

    this.line = 'arrow';
    this.shape = 'rectangle';

    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Editor();
  }

  private get _freeDrawingShapeEnabled() {
    return this.mode === 'shape' || this.mode === 'line' || this.mode === 'text';
  }

  private __resizeCanvas() {
    if (!this.workspace || !this.canvas) return;
    const dimensions = measureElement(this.workspace);
    this.canvas.setDimensions({ width: dimensions.width, height: dimensions.height });
    this.canvas.requestRenderAll();
  }

  private __setupResizeObserver() {
    if (!this.workspace) return;

    this._observer = new ResizeObserver(throttle(this.__resizeCanvas, 200));
    this._observer.observe(this.workspace);
    this.__resizeCanvas();
  }

  private __windowScrollEvent() {
    if (!this.canvas || !this.scrollSync) return;

    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - this._lastScrollY;

    const viewportTransform: fabric.TMat2D = [...this.canvas.viewportTransform];
    viewportTransform[5] -= scrollDelta;
    this.canvas.setViewportTransform(viewportTransform);
    this._lastScrollY = currentScrollY;
  }

  private __canvasMouseDownEvent(event: fabric.TPointerEventInfo<fabric.TPointerEvent>) {
    if (!this.canvas || !this._freeDrawingShapeEnabled) return;

    switch (this.mode) {
      case 'shape': {
        const pointer = this.canvas.getScenePoint(event.e);
        const fill = this.fill ? this.color : 'transparent';
        const props = { left: pointer.x, top: pointer.y, fill, stroke: this.color, strokeWidth: this.width, selectable: false, erasable: true };

        this.canvas.selection = false;
        this._originPointer = { x: pointer.x, y: pointer.y };

        switch (this.shape) {
          case 'circle':
            this._drawnShape = new fabric.Ellipse(Object.assign({ rx: 1, ry: 1 }, props));
            break;

          case 'rectangle':
            this._drawnShape = new fabric.Rect(Object.assign({ width: 1, height: 1 }, props));
            break;

          case 'triangle':
            this._drawnShape = new fabric.Triangle(Object.assign({ width: 1, height: 1 }, props));
            break;
        }

        if (this._drawnShape) this.canvas.add(this._drawnShape);
        this.canvas.requestRenderAll();
        break;
      }

      case 'text': {
        const pointer = this.canvas.getScenePoint(event.e);
        const text = new fabric.Textbox('Text', { left: pointer.x, top: pointer.y, color: this.color, fontSize: 36, fontFamily: 'Arial' });

        this.canvas.add(text);
        this.canvas.setActiveObject(text);
        this.canvas.requestRenderAll();

        this.mode = 'select';
        text.enterEditing(event.e);
        break;
      }
    }
  }

  private __canvasMouseMoveEvent(event: fabric.TPointerEventInfo<fabric.TPointerEvent>) {
    if (!this.canvas || !this._freeDrawingShapeEnabled || !this._drawnShape || !this._originPointer) return;

    const pointer = this.canvas.getScenePoint(event.e);
    if (this._originPointer.x > pointer.x) this._drawnShape.set({ left: Math.abs(pointer.x) });
    if (this._originPointer.y > pointer.y) this._drawnShape.set({ top: Math.abs(pointer.y) });

    let width = Math.abs(pointer.x - this._originPointer.x);
    let height = Math.abs(pointer.y - this._originPointer.y);

    if (event.e.shiftKey) {
      width = Math.max(width, height);
      height = width;
    }

    switch (this.shape) {
      case 'circle':
        this._drawnShape.set({ rx: width / 2, ry: height / 2 });
        break;

      default:
        this._drawnShape.set({ width, height });
        break;
    }

    this._drawnShape.setCoords();
    this.canvas.requestRenderAll();
  }

  private __canvasMouseUpEvent() {
    if (!this.canvas || !this._freeDrawingShapeEnabled) return;

    this._drawnShape = null;
    this._originPointer = null;
    this.canvas.selection = true;
  }

  private __setupEvents() {
    document.addEventListener('scroll', this.__windowScrollEvent);

    if (this.canvas) {
      const disposeMouseUp = this.canvas.on('mouse:up', this.__canvasMouseUpEvent);
      const disposeMouseMove = this.canvas.on('mouse:move', this.__canvasMouseMoveEvent);
      const disposeMouseDown = this.canvas.on('mouse:down', this.__canvasMouseDownEvent);
      this._disposables.push(disposeMouseDown, disposeMouseMove, disposeMouseUp);
    }
  }

  private __resetEvents() {
    document.removeEventListener('scroll', this.__windowScrollEvent);
    this._disposables.forEach((dispose) => dispose());
  }

  private __setupDrawingBrush() {
    if (!this.canvas) return;

    this._pencil = new fabric.PencilBrush(this.canvas);
    this._eraser = new EraserBrush(this.canvas);

    const dispose = this.canvas.on('path:created', ({ path }) => (path.erasable = true));
    this._disposables.push(dispose);
  }

  private __toggleSelectionMode(mode: EditorMode) {
    if (!this.canvas) return;

    this.canvas.getObjects().forEach((object) => {
      object.selectable = mode === 'select';
      object.hoverCursor = object.selectable ? 'move' : 'default';
    });

    if (mode !== 'select') this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }

  private __toggleFreeDrawingMode(mode: EditorMode) {
    if (!this.canvas) return;
    this.canvas.isDrawingMode = mode === 'pencil' || mode === 'highlighter' || mode === 'eraser';
    this.canvas.requestRenderAll();
  }

  initialize(canvas: fabric.Canvas, workspace: HTMLDivElement) {
    this.canvas = canvas;
    this.workspace = workspace;
    this.__setupResizeObserver();
    this.__setupDrawingBrush();
    this.__setupEvents();
  }

  updateShapeMode(shape: ShapeMode) {
    this.shape = shape;
  }

  updateLineMode(line: LineMode) {
    this.line = line;
  }

  updateColor(color: string) {
    this.color = color;

    if (this.canvas?.freeDrawingBrush) {
      if (this.mode === 'highlighter') {
        this.canvas.freeDrawingBrush.color = theme.alpha(color, 0.3);
      } else {
        this.canvas.freeDrawingBrush.color = color;
      }
      this.canvas.requestRenderAll();
    }
  }

  updateWidth(width: number) {
    this.width = width;

    if (this.canvas?.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.width = width;
      this.canvas.requestRenderAll();
    }
  }

  clearCanvas() {
    if (!this.canvas) return;
    this.canvas.clear();
    this.canvas.requestRenderAll();
  }

  toggleDrawingMode(mode?: EditorMode) {
    if (!this.canvas || !this._pencil || !this._eraser) return;

    if (mode) this.mode = mode;
    this.__toggleSelectionMode(this.mode);
    this.__toggleFreeDrawingMode(this.mode);

    switch (this.mode) {
      case 'pencil':
        this.canvas.freeDrawingBrush = this._pencil;
        this.canvas.freeDrawingBrush.width = this.width;
        this.canvas.freeDrawingBrush.color = this.color;
        break;

      case 'highlighter':
        this.canvas.freeDrawingBrush = this._pencil;
        this.canvas.freeDrawingBrush.width = this.width;
        this.canvas.freeDrawingBrush.color = theme.alpha(this.color, 0.3);
        break;

      case 'eraser':
        this.canvas.freeDrawingBrush = this._eraser;
        this.canvas.freeDrawingBrush.width = this.width;
        break;

      case 'shape':
        // TODO: Implement rectangle tool
        break;

      case 'text':
        // TODO: Implement text tool
        break;

      case 'line':
        // TODO: Implement line tool
        break;
    }

    this.canvas.requestRenderAll();
  }

  dispose() {
    this.__resetEvents();
    this._observer?.disconnect();

    this.canvas = null;
    this.workspace = null;
  }
}

const editor = Editor.createInstance();

export { editor, Editor, type EditorMode, type ShapeMode, type LineMode };
