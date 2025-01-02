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

  private _interval: NodeJS.Timer | null;
  private _timeout: NodeJS.Timeout | null;
  private _runtimeEvents = this.__runtimeEvents.bind(this);

  constructor() {
    this.status = 'idle';
    this.timestamp = 0;
    this.audio = false;

    this._interval = null;
    this._timeout = null;

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
    if (!this._interval) {
      this._interval = setInterval(() => {
        runInAction(() => (this.timestamp += 1));
      }, 1000);
    }
  }

  private __stopTimer(reset?: boolean) {
    if (this._interval) clearInterval(this._interval);
    runInAction(() => {
      if (reset) this.timestamp = 0;
      this._interval = null;
    });
  }

  private __runtimeEvents(message: RuntimeMessage) {
    switch (message.type) {
      case EventConfig.StartStreamCaptureSuccess: {
        runInAction(() => (this.status = 'active'));
        this.__startTimer();
        break;
      }

      case EventConfig.StartStreamCaptureError: {
        this.__stopTimer();
        runInAction(() => (this.status = 'error'));
        toast.error(unwrapError(message.payload.error, 'Something went wrong while starting your recording.'));
        break;
      }

      case EventConfig.SaveCapturedStreamSuccess: {
        runInAction(() => (this.status = 'idle'));
        console.log(message.payload.url);
        break;
      }

      case EventConfig.SaveCapturedStreamError: {
        runInAction(() => (this.status = 'error'));
        toast.error(unwrapError(message.payload.error, 'Something went wrong while saving your recording.'));
        break;
      }
    }
  }

  private __setupEvents() {
    chrome.runtime.onMessage.addListener(this._runtimeEvents);
  }

  private __removeEvents() {
    chrome.runtime.onMessage.removeListener(this._runtimeEvents);
  }

  startScreenCapture() {
    this.status = 'pending';
    this._timeout = setTimeout(() => {
      chrome.runtime.sendMessage({ type: EventConfig.StartStreamCapture });
    }, RECORD_TIMEOUT * 1000);
  }

  saveScreenCapture() {
    this.status = 'saving';
    chrome.runtime.sendMessage({ type: EventConfig.SaveCapturedStream, payload: { timestamp: this.timestamp } });
  }

  cancelScreenCapture() {
    if (this._timeout) clearTimeout(this._timeout);
    this.status = 'idle';
  }

  discardScreenCapture() {
    this.status = 'idle';
    chrome.runtime.sendMessage({ type: EventConfig.DiscardStreamCapture });
    this.__stopTimer();
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
