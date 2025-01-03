import * as fabric from 'fabric';
import { EraserBrush } from '@erase2d/fabric';

import { makeAutoObservable } from 'mobx';
import { throttle } from 'lodash';
import { theme } from '@rekorder.io/ui';

import { measureElement } from '../lib/utils';

type EditorMode = 'pencil' | 'highlighter' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'text' | 'select';

class Editor {
  canvas: fabric.Canvas | null;
  workspace: HTMLDivElement | null;

  color: string;
  width: number;
  mode: EditorMode;
  scrollSync: boolean;

  private _eraser: EraserBrush | null = null;
  private _observer: ResizeObserver | null = null;
  private _pencil: fabric.PencilBrush | null = null;
  private _disposables: VoidFunction[] = [];
  private _lastScrollY = 0;

  constructor() {
    this.canvas = null;
    this.workspace = null;

    this.width = 10;
    this.mode = 'pencil';
    this.color = '#000000';
    this.scrollSync = true;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Editor();
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

  private __syncViewportWithScroll() {
    if (!this.canvas || !this.scrollSync) return;

    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - this._lastScrollY;

    const viewportTransform: fabric.TMat2D = [...this.canvas.viewportTransform];
    viewportTransform[5] -= scrollDelta;
    this.canvas.setViewportTransform(viewportTransform);
    this._lastScrollY = currentScrollY;
  }

  private __setupEvents() {
    document.addEventListener('scroll', this.__syncViewportWithScroll);
  }

  private __resetEvents() {
    document.removeEventListener('scroll', this.__syncViewportWithScroll);
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

      case 'rectangle':
        // TODO: Implement rectangle tool
        break;

      case 'circle':
        // TODO: Implement circle tool
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
    this._disposables.forEach((dispose) => dispose());

    this.canvas = null;
    this.workspace = null;
  }
}

const editor = Editor.createInstance();

export { editor, Editor, type EditorMode };
