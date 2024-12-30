import exportWebmBlob from 'fix-webm-duration';

import { RuntimeMessage } from '@rekorder.io/types';
import { makeAutoObservable, runInAction } from 'mobx';

import { RECORD_TIMEOUT } from '../constants/recorder';
import { microphone } from './microphone';

class Recorder {
  audio: boolean;
  timestamp: number;
  status: 'idle' | 'active' | 'pending' | 'saving' | 'paused' | 'error';

  private stream: MediaStream | null;
  private recorder: MediaRecorder | null;
  private chunks: Blob[];

  private interval: NodeJS.Timer | null;
  private timeout: NodeJS.Timeout | null;

  private helperAudioContext: AudioContext | null;

  constructor() {
    this.status = 'idle';
    this.timestamp = 0;
    this.audio = false;

    this.recorder = null;
    this.chunks = [];
    this.stream = null;

    this.interval = null;
    this.timeout = null;
    this.helperAudioContext = null;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Recorder();
  }

  get time() {
    const minutes = Math.floor(this.timestamp / 60);
    const seconds = this.timestamp % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  private __startTimer() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        runInAction(() => (this.timestamp += 1));
      }, 1000);
    }
  }

  private __stopTimer(reset?: boolean) {
    if (this.interval) clearInterval(this.interval);
    if (reset) this.timestamp = 0;
    this.interval = null;
  }

  private __recorderDataAvailable(event: BlobEvent) {
    if (event.data.size > 0) this.chunks.push(event.data);
  }

  private __exportWebmBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    window.open(url);
    this.status = 'idle';
  }

  private __recorderDataSaved() {
    const blob = new Blob(this.chunks, { type: 'video/webm' });
    exportWebmBlob(blob, this.timestamp, this.__exportWebmBlob, { logger: false });
    this.__stopTimer(true);
    this.chunks = [];
  }

  private __preventTabSilence(media: MediaStream) {
    this.helperAudioContext = new AudioContext();
    const source = this.helperAudioContext.createMediaStreamSource(media);
    source.connect(this.helperAudioContext.destination);
  }

  private __captureStreamSuccess([video, audio]: [MediaStream, MediaStream | null]) {
    this.status = 'active';
    this.stream = video;

    console.log(video, audio);

    const combined = new MediaStream([...video.getVideoTracks(), ...(audio ? audio.getAudioTracks() : []), ...(this.audio ? video.getAudioTracks() : [])]);

    const output = new AudioContext();
    const source = output.createMediaStreamSource(video);
    source.connect(output.destination);

    this.recorder = new MediaRecorder(combined, { mimeType: 'video/webm; codecs=vp9,opus' });
    this.recorder.addEventListener('dataavailable', this.__recorderDataAvailable);
    this.recorder.addEventListener('stop', this.__recorderDataSaved);

    this.__preventTabSilence(video);
    this.recorder.start();
    this.__startTimer();
  }

  private __captureStreamError(error: Error) {
    this.status = 'error';
    this.__stopTimer(true);
    console.error(error);
  }

  private __createStream() {
    return new Promise<MediaStream>((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: 'capture.tab',
          payload: null,
        } satisfies RuntimeMessage,
        (response: RuntimeMessage) => {
          switch (response.type) {
            case 'capture.tab.sucesss':
              navigator.mediaDevices
                .getUserMedia({
                  audio: {
                    mandatory: {
                      chromeMediaSource: 'tab',
                      chromeMediaSourceId: response.payload.streamId,
                    },
                  },
                  video: {
                    mandatory: {
                      chromeMediaSource: 'tab',
                      chromeMediaSourceId: response.payload.streamId,
                    },
                  },
                } as MediaStreamConstraints)
                .then(resolve)
                .catch(reject);
              break;

            case 'capture.tab.error':
              reject(response.payload.error);
              break;

            default:
              reject({ message: 'Unhandled message: ' + response.type });
              break;
          }
        }
      );
    });
  }

  startScreenCapture() {
    this.status = 'pending';
    this.timeout = setTimeout(() => {
      const promise = [this.__createStream(), microphone.createStream()] as const;
      Promise.all(promise).then(this.__captureStreamSuccess).catch(this.__captureStreamError);
    }, RECORD_TIMEOUT * 1000);
  }

  stopScreenCapture() {
    if (!this.recorder || this.recorder.state === 'inactive') {
      this.status = 'idle';
      this.__stopTimer(true);
    } else {
      this.recorder.stop();
      this.status = 'saving';
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  cancelScreenCapture() {
    if (this.timeout) clearTimeout(this.timeout);
    this.status = 'idle';
  }

  pauseScreenCapture() {
    if (this.recorder) {
      if (this.recorder.state === 'recording') this.recorder.pause();
      this.status = 'paused';
      this.__stopTimer();
    }
  }

  resumeScreenCapture() {
    if (this.recorder) {
      if (this.recorder.state === 'paused') this.recorder.resume();
      this.status = 'active';
      this.__startTimer();
    }
  }
}

const recorder = Recorder.createInstance();

export { recorder, Recorder };
