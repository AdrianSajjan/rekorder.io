import { makeAutoObservable, runInAction } from 'mobx';
import { fetchFile } from '@ffmpeg/util';
import { ProgressEvent } from '@ffmpeg/ffmpeg';

import { wait } from '@rekorder.io/utils';
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
  private _ffmpegProgressHandler = this.__ffmpegProgressHandler.bind(this);

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

  private __ffmpegProgressHandler(event: ProgressEvent) {
    this.progress = Math.min(Math.round(event.progress * 100), 100);
  }

  async crop() {
    this._controller = new AbortController();
    const { x, y, width, height } = this.coordinates;
    this._editor.ffmpeg.on('progress', this._ffmpegProgressHandler);
    runInAction(() => (this.status = 'processing'));

    try {
      const input = await fetchFile(this._editor.mp4RecordingOrThrow);
      await this._editor.ffmpeg.writeFile('input.webm', input);

      const status = await this._editor.ffmpeg.exec(
        ['-i', 'input.webm', '-filter:v', `crop=${width}:${height}:${x}:${y}`, '-c:v', 'libvpx', '-crf', '10', '-b:v', '0', '-c:a', 'libvorbis', 'output.webm'],
        60 * 60 * 1000, // 60 minutes
        { signal: this._controller.signal }
      );

      const output = await this._editor.ffmpeg.readFile('output.webm');
      const data = output as Uint8Array;

      if (status !== 0) throw new Error('Oops, something went wrong while cropping the video!');
      this._controller.signal.throwIfAborted();

      runInAction(() => (this.status = 'completed'));
      wait(1500).then(() => runInAction(() => (this.status = 'idle')));

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

      const blob = new Blob([data.buffer], { type: 'video/webm' });
      this._editor.modifyRecording(blob, blob);
    } catch (error) {
      runInAction(() => (this.status = 'error'));
      wait(1500).then(() => runInAction(() => (this.status = 'idle')));
      throw error;
    } finally {
      runInAction(() => (this.progress = 0));
      this._editor.ffmpeg.off('progress', this._ffmpegProgressHandler);
    }
  }

  abort() {
    if (this._controller) this._controller.abort();
    this._editor.ffmpeg.terminate();
    this._editor.initializeFFmpeg();
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
