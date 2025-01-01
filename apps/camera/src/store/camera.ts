import '@tensorflow/tfjs-backend-webgpu';
import * as BodySegmentation from '@tensorflow-models/body-segmentation';

import { makeAutoObservable } from 'mobx';
import { Autocomplete, CameraEffects, RuntimeMessage } from '@rekorder.io/types';
import { CameraConfig, EventConfig } from '@rekorder.io/constants';

class Camera {
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
    this.stream = null;
    this.device = 'n/a';
    this.effect = 'none';
    this.status = 'idle';

    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.preview = document.createElement('canvas');

    this.__setupStore();
    this.__setupEvents();

    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Camera();
  }

  private __setupStore() {
    chrome.storage.local.get([CameraConfig.DeviceId, CameraConfig.Effect], (result) => {
      this.device = result[CameraConfig.DeviceId] || 'n/a';
      this.effect = result[CameraConfig.Effect] || 'none';
    });
  }

  private __setupEvents() {
    chrome.runtime.onMessage.addListener(this.__runtimeMessageHandler);
    window.addEventListener('message', this.__windowMessageHandler);
  }

  private __disposeEvents() {
    chrome.runtime.onMessage.removeListener(this.__runtimeMessageHandler);
    window.removeEventListener('message', this.__windowMessageHandler);
  }

  private __runtimeMessageHandler(message: RuntimeMessage, sender: chrome.runtime.MessageSender, response: (message: RuntimeMessage) => void) {
    // TODO: Implement runtime message handler if required
  }

  private __windowMessageHandler(event: MessageEvent<RuntimeMessage>) {
    switch (event.data.type) {
      case EventConfig.CameraDevice:
        this.device = event.data.payload.device;
        break;
      case EventConfig.CameraEffect:
        this.effect = event.data.payload.effect;
        break;
    }
  }

  private __resizeCanvas() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.preview.width = this.video.videoWidth;
    this.preview.height = this.video.videoHeight;
  }

  private __drawCanvas(source: CanvasImageSource) {
    const context = this.canvas.getContext('2d')!;
    context.drawImage(source, 0, 0, this.canvas.width, this.canvas.height);
  }

  private async __renderWithoutEffects() {
    this.__resizeCanvas();
    this.__drawCanvas(this.video);
    this.tick = requestAnimationFrame(this.__renderWithoutEffects);
  }

  private async __renderBlurBackground() {
    const segmenter = await this.__createSelfieSegmentationModel();
    const segmentation = await segmenter.segmentPeople(this.video);
    this.__resizeCanvas();

    await BodySegmentation.drawBokehEffect(this.preview, this.video, segmentation, 0.5, 5, 15, false);
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
      this.segmenter = await BodySegmentation.createSegmenter(BodySegmentation.SupportedModels.MediaPipeSelfieSegmentation, {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
        modelType: 'general',
      });
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

  initializeElements(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.video = video;
    this.canvas = canvas;
  }

  createStream() {
    if (this.device !== 'n/a') {
      this.status = 'pending';
      const options = { video: { deviceId: this.device }, audio: false };
      navigator.mediaDevices.getUserMedia(options).then(this.__createStreamSuccess).catch(this.__createSteamError);
    }
  }

  cancelStream() {
    if (this.tick) cancelAnimationFrame(this.tick);
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());

    this.tick = null;
    this.stream = null;
    this.video.srcObject = null;
  }

  dispose() {
    this.__disposeEvents();
  }
}

const camera = Camera.createInstance();

export { camera, Camera, type CameraEffects };
