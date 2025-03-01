import { makeAutoObservable } from 'mobx';
import { Editor } from './editor';

export interface CropPosition {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface CropCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CropStatus = 'idle' | 'processing' | 'completed' | 'error';

export class Cropper {
  progress: number;
  status: CropStatus;
  position: CropPosition;

  scaledDimensions: Pick<CropCoordinates, 'width' | 'height'>;
  originalDimensions: Pick<CropCoordinates, 'width' | 'height'>;

  private _editor: Editor;
  private _controller: AbortController | null;

  constructor(editor: Editor) {
    this.progress = 0;
    this.status = 'idle';

    this.position = { top: 0, left: 0, bottom: 0, right: 0 };
    this.scaledDimensions = { width: 0, height: 0 };
    this.originalDimensions = { width: 0, height: 0 };

    this._editor = editor;
    this._controller = null;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get coordinates() {
    const widthRatio = this.originalDimensions.width / this.scaledDimensions.width;
    const heightRatio = this.originalDimensions.height / this.scaledDimensions.height;

    return {
      x: Math.round(this.position.left * widthRatio),
      y: Math.round(this.position.top * heightRatio),
      width: Math.round((this.position.right - this.position.left) * widthRatio),
      height: Math.round((this.position.bottom - this.position.top) * heightRatio),
    };
  }

  async crop() {
    // TODO: Implement crop
  }

  abort() {
    if (this._controller) {
      this._controller.abort();
    }
  }

  initializePosition(position: CropPosition) {
    this.position = position;
    this.originalDimensions = { width: this._editor.elementOrThrow.videoWidth, height: this._editor.elementOrThrow.videoHeight };
    this.scaledDimensions = { width: this._editor.elementOrThrow.getBoundingClientRect().width, height: this._editor.elementOrThrow.getBoundingClientRect().height };
  }

  changePosition(key: keyof CropPosition, value: number) {
    this.position[key] = value;
  }

  changeCoordinate(key: keyof CropCoordinates, value: number) {
    const widthRatio = this.originalDimensions.width / this.scaledDimensions.width;
    const heightRatio = this.originalDimensions.height / this.scaledDimensions.height;

    switch (key) {
      case 'x':
        this.position.left = value / widthRatio;
        break;
      case 'y':
        this.position.top = value / heightRatio;
        break;
      case 'width':
        this.position.right = this.position.left + value / widthRatio;
        break;
      case 'height':
        this.position.bottom = this.position.top + value / heightRatio;
        break;
    }
  }
}
