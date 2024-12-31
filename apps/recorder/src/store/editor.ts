import * as fabric from 'fabric';

import { makeAutoObservable } from 'mobx';
import { throttle } from 'lodash';

import { measureElement } from '../lib/utils';

class Editor {
  canvas: fabric.Canvas | null;
  workspace: HTMLDivElement | null;

  private resizeObserver?: ResizeObserver;

  constructor() {
    this.canvas = null;
    this.workspace = null;
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

    this.resizeObserver = new ResizeObserver(throttle(this.__resizeCanvas, 200));
    this.resizeObserver.observe(this.workspace);
    this.__resizeCanvas();
  }

  initialize(canvas: fabric.Canvas, workspace: HTMLDivElement) {
    this.canvas = canvas;
    this.workspace = workspace;
    this.__setupResizeObserver();
  }

  toggleFreeDrawingMode(enabled?: boolean) {
    if (!this.canvas) return;
    this.canvas.isDrawingMode = enabled ?? !this.canvas.isDrawingMode;
  }

  setupFreeDrawingBrush() {
    if (!this.canvas) return;
    const brush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush = brush;
    this.canvas.freeDrawingBrush.width = 10;
    this.canvas.freeDrawingBrush.color = '#000';
  }

  dispose() {
    this.resizeObserver?.disconnect();
    this.canvas = null;
    this.workspace = null;
  }
}

const editor = Editor.createInstance();

export { editor, Editor };
