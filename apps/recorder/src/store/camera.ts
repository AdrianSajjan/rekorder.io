import '@tensorflow/tfjs-backend-webgpu';

import * as BodySegmentation from '@tensorflow-models/body-segmentation';
import { makeAutoObservable } from 'mobx';
import { Autocomplete } from '../types/core';

type CameraEffects = 'none' | 'blur' | 'image';

class Camera {
  flip: boolean;
  enabled: boolean;

  effect: CameraEffects;
  device: Autocomplete<'n/a'>;

  stream: MediaStream | null;
  status: 'idle' | 'pending' | 'initialized' | 'error';

  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private preview: HTMLCanvasElement;

  private tick: number | null = null;
  private segmenter: BodySegmentation.BodySegmenter | null = null;

  constructor() {
    this.flip = true;
    this.enabled = true;

    this.stream = null;
    this.device = 'n/a';
    this.effect = 'none';
    this.status = 'idle';

    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.preview = document.createElement('canvas');
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Camera();
  }

  private __resizeCanvas() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.preview.width = this.video.videoWidth;
    this.preview.height = this.video.videoHeight;
  }

  private __drawCanvas(source: CanvasImageSource) {
    const context = this.canvas.getContext('2d')!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    context.save();

    if (this.flip) {
      context.scale(-1, 1);
      context.translate(-this.canvas.width, 0);
    }

    context.drawImage(source, 0, 0, this.canvas.width, this.canvas.height);
    context.restore();
  }

  private async __renderWithoutEffects() {
    this.__resizeCanvas();
    this.__drawCanvas(this.video);
    this.tick = requestAnimationFrame(this.__renderWithoutEffects);
  }

  private async __renderBlurBackground() {
    const segmenter = await this.__createSelfieSegmentationModel();
    const segmentation = await segmenter.segmentPeople(this.video);
    await BodySegmentation.drawBokehEffect(this.preview, this.video, segmentation, 0.5, 5, 15, false);

    this.__resizeCanvas();
    this.__drawCanvas(this.preview);
    this.tick = requestAnimationFrame(this.__renderBlurBackground);
  }

  private async __renderImageBackground() {
    this.__resizeCanvas();
    this.__drawCanvas(this.video);
    this.tick = requestAnimationFrame(this.__renderImageBackground);
  }

  private async __createSelfieSegmentationModel() {
    if (!this.segmenter) {
      this.segmenter = await BodySegmentation.createSegmenter(
        BodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
        {
          runtime: 'mediapipe',
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
          modelType: 'general',
        }
      );
    }
    return this.segmenter;
  }

  private __videoMetadataLoaded() {
    this.video.play();
    this.status = 'initialized';
    this.__renderStream();
  }

  private __videoMetadataError() {
    this.status = 'error';
  }

  private __createStreamSuccess(stream: MediaStream) {
    this.video.addEventListener('loadedmetadata', this.__videoMetadataLoaded, { once: true });
    this.video.addEventListener('error', this.__videoMetadataError, { once: true });
    this.stream = stream;
    this.video.srcObject = stream;
  }

  private __createSteamError() {
    this.status = 'error';
  }

  private __renderStream() {
    switch (this.effect) {
      case 'none':
        this.__renderWithoutEffects();
        break;
      case 'blur':
        this.__renderBlurBackground();
        break;
      case 'image':
        this.__renderImageBackground();
        break;
    }
  }

  changeDevice(device: Autocomplete<'n/a'>) {
    this.device = device;
    if (this.enabled) {
      if (this.device === 'n/a') this.cancelStream();
      else this.createStream();
    }
    return this;
  }

  updateEffect(effect: CameraEffects) {
    this.effect = effect;
    if (this.status === 'initialized') {
      this.cancelStream().__renderStream();
    }
    return this;
  }

  updateFlip(value: boolean | 'toggle') {
    this.flip = value === 'toggle' ? !this.flip : value;
    return this;
  }

  updateEnabled(value: boolean | 'toggle') {
    this.enabled = value === 'toggle' ? !this.enabled : value;
    return this;
  }

  initializeElements(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.video = video;
    this.canvas = canvas;
    return this;
  }

  createStream() {
    if (this.device !== 'n/a') {
      this.status = 'pending';
      const options = { video: { deviceId: this.device }, audio: false };
      navigator.mediaDevices.getUserMedia(options).then(this.__createStreamSuccess).catch(this.__createSteamError);
    }
    return this;
  }

  cancelStream() {
    if (this.tick) cancelAnimationFrame(this.tick);
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());

    this.tick = null;
    this.stream = null;
    this.video.srcObject = null;

    return this;
  }
}

const camera = Camera.createInstance();

export { camera, Camera, type CameraEffects };
