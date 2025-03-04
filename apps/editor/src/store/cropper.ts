import { makeAutoObservable, runInAction } from 'mobx';
import { VideoCropper } from '@rekorder.io/player';
import { Editor } from './editor';
import { wait } from '@rekorder.io/utils';

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

    const x = Math.round(this.position.left * widthRatio);
    const y = Math.round(this.position.top * heightRatio);
    const width = Math.round((this.position.right - this.position.left) * widthRatio);
    const height = Math.round((this.position.bottom - this.position.top) * heightRatio);

    return {
      x: isNaN(x) ? 0 : x,
      y: isNaN(y) ? 0 : y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height,
    };
  }

  async crop() {
    runInAction(() => (this.status = 'processing'));
    this._controller = new AbortController();
    const url = URL.createObjectURL(this._editor.mp4RecordingOrThrow);

    const cropper = VideoCropper.createInstance(url, {
      signal: this._controller.signal,
      onProgress: (progress) => {
        runInAction(() => (this.progress = Math.round(progress)));
      },
    });

    try {
      const { x, y, width, height } = this.coordinates;
      await cropper.initialize({ top: y, left: x, right: x + width, bottom: y + height });
      const blob = await cropper.process();

      wait(1500).then(() => runInAction(() => (this.status = 'idle')));
      runInAction(() => (this.status = 'completed'));

      this._editor.elementOrThrow.addEventListener(
        'loadeddata',
        () => {
          runInAction(() => {
            const rect = this._editor.elementOrThrow.getBoundingClientRect();
            this.position = { top: 0, left: 0, bottom: rect.height, right: rect.width };
            this.originalDimensions = { width: this._editor.elementOrThrow.videoWidth, height: this._editor.elementOrThrow.videoHeight };
            this.scaledDimensions = { width: rect.width, height: rect.height };
          });
        },
        { once: true }
      );

      this._editor.modifyRecording(blob, blob);
    } catch (error) {
      runInAction(() => (this.status = 'error'));
      wait(1500).then(() => runInAction(() => (this.status = 'idle')));
      throw error;
    } finally {
      runInAction(() => (this.progress = 0));
      cropper.destroy();
    }
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
