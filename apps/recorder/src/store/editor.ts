import * as fabric from 'fabric';

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

  private resizeObserver?: ResizeObserver;

  constructor() {
    this.canvas = null;
    this.workspace = null;
    this.mode = 'pencil';
    this.color = '#000000';
    this.width = 10;
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
    this.canvas.isDrawingMode = mode === 'pencil' || mode === 'highlighter';
    this.canvas.requestRenderAll();
  }

  initialize(canvas: fabric.Canvas, workspace: HTMLDivElement) {
    this.canvas = canvas;
    this.workspace = workspace;
    this.__setupResizeObserver();
  }

  toggleDrawingMode(mode?: EditorMode) {
    if (!this.canvas) return;

    if (mode) this.mode = mode;
    this.__toggleSelectionMode(this.mode);
    this.__toggleFreeDrawingMode(this.mode);

    switch (this.mode) {
      case 'pencil':
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.width = this.width;
        this.canvas.freeDrawingBrush.color = this.color;
        break;

      case 'highlighter':
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.width = this.width;
        this.canvas.freeDrawingBrush.color = theme.alpha(this.color, 0.3);
        break;

      case 'eraser':
        // TODO: Implement eraser brush
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
    this.resizeObserver?.disconnect();
    this.canvas = null;
    this.workspace = null;
  }
}

const editor = Editor.createInstance();

export { editor, Editor, type EditorMode };
