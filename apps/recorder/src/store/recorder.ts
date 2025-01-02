import { makeAutoObservable, runInAction } from 'mobx';

import { EventConfig } from '@rekorder.io/constants';
import { RECORD_TIMEOUT } from '../constants/recorder';
import { RuntimeMessage } from '@rekorder.io/types';
import { toast } from 'sonner';
import { unwrapError } from '@rekorder.io/utils';

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

    this.__setupEvents();
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

  private __runtimeEvents(message: RuntimeMessage) {
    switch (message.type) {
      case EventConfig.StartStreamCaptureSuccess: {
        this.status = 'active';
        this.__startTimer();
        break;
      }

      case EventConfig.StartStreamCaptureError: {
        this.__stopTimer();
        this.status = 'error';
        toast.error(unwrapError(message.payload.error, 'Something went wrong while starting your recording.'));
        break;
      }

      case EventConfig.SaveCapturedStreamSuccess: {
        this.status = 'idle';
        console.log(message.payload.url);
        break;
      }

      case EventConfig.SaveCapturedStreamError: {
        this.status = 'error';
        toast.error(unwrapError(message.payload.error, 'Something went wrong while saving your recording.'));
        break;
      }
    }
  }

  private __setupEvents() {
    chrome.runtime.onMessage.addListener(this.__runtimeEvents);
  }

  private __removeEvents() {
    chrome.runtime.onMessage.removeListener(this.__runtimeEvents);
  }

  startScreenCapture() {
    this.status = 'pending';
    this.timeout = setTimeout(() => {
      chrome.runtime.sendMessage({ type: EventConfig.StartStreamCapture });
    }, RECORD_TIMEOUT * 1000);
  }

  stopScreenCapture() {
    this.status = 'saving';
    chrome.runtime.sendMessage({ type: EventConfig.CancelStreamCapture, payload: { timestamp: this.timestamp } });
  }

  cancelScreenCapture() {
    if (this.timeout) clearTimeout(this.timeout);
    this.status = 'idle';
    chrome.runtime.sendMessage({ type: EventConfig.CancelStreamCapture, payload: { timestamp: this.timestamp } });
  }

  pauseScreenCapture() {
    if (this.status === 'active') {
      this.status = 'paused';
      chrome.runtime.sendMessage({ type: EventConfig.PauseStreamCapture });
      this.__stopTimer();
    }
  }

  resumeScreenCapture() {
    if (this.status === 'paused') {
      this.status = 'active';
      chrome.runtime.sendMessage({ type: EventConfig.ResumeStreamCapture });
      this.__startTimer();
    }
  }

  dispose() {
    this.__removeEvents();
  }
}

const recorder = Recorder.createInstance();

export { recorder, Recorder };
