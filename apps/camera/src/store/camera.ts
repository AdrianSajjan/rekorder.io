import '@tensorflow/tfjs-backend-webgpu';
import * as BodySegmentation from '@tensorflow-models/body-segmentation';

import { makeAutoObservable } from 'mobx';
import { Autocomplete, CameraEffects, RuntimeMessage } from '@rekorder.io/types';
import { StorageConfig, EventConfig } from '@rekorder.io/constants';

class Camera {
  effect: CameraEffects;
  device: Autocomplete<'n/a'>;

  stream: MediaStream | null;
  status: 'idle' | 'pending' | 'initialized' | 'error';

  private video: HTMLVideoElement = null!;
  private canvas: HTMLCanvasElement = null!;
  private preview: HTMLCanvasElement = null!;

  private tick: number | null = null;
  private segmenter: BodySegmentation.BodySegmenter | null = null;

  constructor() {
    this.stream = null;
    this.device = 'n/a';
    this.effect = 'none';
    this.status = 'idle';

    this.__setupStore();
    this.__setupEvents();

    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Camera();
  }

  private __setupStore() {
    chrome.storage.local.get([StorageConfig.CameraDeviceId, StorageConfig.CameraEffect], (result) => {
      this.device = result[StorageConfig.CameraDeviceId] || 'n/a';
      this.effect = result[StorageConfig.CameraEffect] || 'none';
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
      case EventConfig.ChangeCameraDevice:
        this.device = event.data.payload.device;
        break;
      case EventConfig.ChangeCameraEffect:
        this.effect = event.data.payload.effect;
        break;
    }
  }

  private __resizeCanvas() {
    if (this.video.videoWidth !== this.canvas.width || this.video.videoHeight !== this.canvas.height) {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
    }
    if (this.video.videoWidth !== this.preview.width || this.video.videoHeight !== this.preview.height) {
      this.preview.width = this.video.videoWidth;
      this.preview.height = this.video.videoHeight;
    }
  }

  private __drawCanvas(source: CanvasImageSource) {
    const context = this.canvas.getContext('2d')!;
    context.drawImage(source, 0, 0, this.canvas.width, this.canvas.height);
  }

  private async __renderWithoutEffects() {
    this.__resizeCanvas();
    this.__drawCanvas(this.video);
    this.tick = this.video.requestVideoFrameCallback(this.__renderWithoutEffects);
  }

  private async __renderBlurBackground() {
    const segmenter = await this.__createSelfieSegmentationModel();
    const segmentation = await segmenter.segmentPeople(this.video);

    this.__resizeCanvas();
    await BodySegmentation.drawBokehEffect(this.preview, this.video, segmentation, 0.5, 5, 15, false);
    this.__drawCanvas(this.preview);

    this.tick = this.video.requestVideoFrameCallback(this.__renderBlurBackground);
  }

  private async __renderImageBackground() {
    this.__resizeCanvas();
    this.__drawCanvas(this.video);
    this.tick = this.video.requestVideoFrameCallback(this.__renderImageBackground);
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

  private __videoLoadedEvent() {
    this.video.play();
    this.status = 'initialized';
    this.__renderStream();
  }

  private __videoErrorEvent() {
    this.status = 'error';
  }

  private __createStreamSuccess(stream: MediaStream) {
    this.stream = stream;
    this.video.addEventListener('loadeddata', this.__videoLoadedEvent, { once: true });
    this.video.addEventListener('error', this.__videoErrorEvent, { once: true });
    this.video.srcObject = stream;
  }

  private __createSteamError() {
    this.status = 'error';
  }

  private __renderStream() {
    switch (this.effect) {
      case 'none':
        this.tick = this.video.requestVideoFrameCallback(this.__renderWithoutEffects);
        break;
      case 'blur':
        this.tick = this.video.requestVideoFrameCallback(this.__renderBlurBackground);
        break;
      case 'image':
        this.tick = this.video.requestVideoFrameCallback(this.__renderImageBackground);
        break;
    }
  }

  private __cancelStream() {
    if (this.tick) this.video.cancelVideoFrameCallback(this.tick);
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());

    this.tick = null;
    this.stream = null;

    this.video = null!;
    this.canvas = null!;
    this.preview = null!;
  }

  initialize(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.video = video;
    this.canvas = canvas;
    this.preview = document.createElement('canvas');
  }

  start() {
    if (this.device !== 'n/a') {
      this.status = 'pending';
      const options: MediaStreamConstraints = {
        video: {
          deviceId: this.device,
          frameRate: { ideal: 30, max: 30, min: 24 },
        },
        audio: false,
      };
      navigator.mediaDevices.getUserMedia(options).then(this.__createStreamSuccess).catch(this.__createSteamError);
    }
  }

  dispose() {
    this.__cancelStream();
    this.__disposeEvents();
  }
}

const camera = Camera.createInstance();

export { camera, Camera, type CameraEffects };
