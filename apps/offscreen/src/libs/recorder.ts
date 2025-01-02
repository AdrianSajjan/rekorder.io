import exportWebmBlob from 'fix-webm-duration';
import { EventConfig } from '@rekorder.io/constants';

class OffscreenRecorder {
  chunks: Blob[];
  timestamp: number;
  muted: boolean;

  audio: MediaStream | null;
  stream: MediaStream | null;
  video: MediaStream | null;
  recorder: MediaRecorder | null;

  deviceAudio: boolean;
  audioContext: AudioContext | null;

  constructor() {
    this.chunks = [];
    this.timestamp = 0;

    this.muted = false;
    this.deviceAudio = false;

    this.audio = null;
    this.recorder = null;
    this.stream = null;
    this.audioContext = null;
    this.video = null;
  }

  static createInstance() {
    return new OffscreenRecorder();
  }

  private __recorderDataAvailable(event: BlobEvent) {
    if (event.data.size > 0) this.chunks.push(event.data);
  }

  private __exportWebmBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    chrome.runtime.sendMessage({ type: EventConfig.StreamSaveSuccess, payload: { url } });
  }

  private __recorderDataSaved() {
    const blob = new Blob(this.chunks, { type: 'video/webm' });
    exportWebmBlob(blob, this.timestamp, this.__exportWebmBlob.bind(this), { logger: false });
    this.chunks = [];
  }

  private __preventTabSilence(media: MediaStream) {
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(media);
    source.connect(this.audioContext.destination);
  }

  private __captureStreamSuccess() {
    if (!this.video) return;

    this.__preventTabSilence(this.video);
    chrome.runtime.sendMessage({ type: EventConfig.StreamCaptureSuccess, payload: null });

    const combined = [...this.video.getVideoTracks()];
    if (this.audio) combined.push(...this.audio.getAudioTracks());
    if (this.deviceAudio) combined.push(...this.video.getAudioTracks());

    this.stream = new MediaStream(combined);
    this.recorder = new MediaRecorder(this.stream, { mimeType: 'video/webm; codecs=vp9,opus' });

    this.recorder.addEventListener('dataavailable', this.__recorderDataAvailable.bind(this));
    this.recorder.addEventListener('stop', this.__recorderDataSaved.bind(this));
    this.recorder.start();
  }

  private __captureStreamError(error: unknown) {
    chrome.runtime.sendMessage({ type: EventConfig.StreamCaptureError, payload: { error } });
  }

  async start(sourceId: string, microphoneId: string) {
    try {
      this.video = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'tab',
            chromeMediaSourceId: sourceId,
          },
        },
        video: {
          mandatory: {
            chromeMediaSource: 'tab',
            chromeMediaSourceId: sourceId,
          },
        },
      } as MediaStreamConstraints);

      if (!!microphoneId && microphoneId !== 'n/a') {
        this.audio = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: microphoneId,
          },
        });
      }

      this.__captureStreamSuccess();
    } catch (error) {
      this.__captureStreamError(error);
    }
  }

  stop(timestamp?: number) {
    if (timestamp) this.timestamp = timestamp;
    this.recorder?.stop();

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  pause() {
    if (this.recorder?.state === 'recording') {
      this.recorder.pause();
    }
  }

  resume() {
    if (this.recorder?.state === 'paused') {
      this.recorder.resume();
    }
  }
}

const recorder = OffscreenRecorder.createInstance();

export { OffscreenRecorder, recorder };
