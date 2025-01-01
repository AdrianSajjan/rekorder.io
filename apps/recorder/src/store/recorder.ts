import exportWebmBlob from 'fix-webm-duration';

import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'sonner';

import { RuntimeMessage } from '@rekorder.io/types';
import { unwrapError } from '@rekorder.io/utils';

import { RECORD_TIMEOUT } from '../constants/recorder';
import { microphone } from './microphone';
import { StreamConfig } from '@rekorder.io/constants';

class Recorder {
  audio: boolean;
  timestamp: number;
  status: 'idle' | 'active' | 'pending' | 'saving' | 'paused' | 'error';

  private interval: NodeJS.Timer | null;
  private timeout: NodeJS.Timeout | null;

  constructor() {
    this.status = 'idle';
    this.timestamp = 0;
    this.audio = false;

    this.interval = null;
    this.timeout = null;
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

  startScreenCapture() {
    this.status = 'pending';
    this.timeout = setTimeout(() => {}, RECORD_TIMEOUT * 1000);
  }

  stopScreenCapture() {
    this.status = 'saving';
    chrome.runtime.sendMessage({ type: StreamConfig.StopCapture });
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
