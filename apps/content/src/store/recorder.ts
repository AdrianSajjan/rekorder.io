import { toast } from 'sonner';
import { makeAutoObservable, runInAction } from 'mobx';
import { isUndefined } from 'lodash';

import { EventConfig, StorageConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { unwrapError } from '@rekorder.io/utils';

import { microphone } from './microphone';
import { RECORDER_ROOT } from '../constants/layout';
import { RECORD_TIMEOUT } from '../constants/recorder';

class Recorder {
  audio: boolean;
  timestamp: number;
  initialized: boolean;
  status: 'idle' | 'countdown' | 'pending' | 'active' | 'paused' | 'saving' | 'error';

  private _interval: NodeJS.Timer | null;
  private _timeout: NodeJS.Timeout | null;
  private _runtimeEvents = this.__runtimeEvents.bind(this);

  constructor() {
    this.initialized = false;
    this.status = 'idle';
    this.timestamp = 0;
    this.audio = false;

    this._interval = null;
    this._timeout = null;

    this.__setupState();
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

  /**
   * Comment out during development and uncomment runInAction(() => (this.initialized = true));
   */
  private async __setupState() {
    // runInAction(() => (this.initialized = true));
    try {
      const result = await chrome.storage.session.get([StorageConfig.RecorderStatus, StorageConfig.RecorderTimestamp]);
      const state = result[StorageConfig.RecorderStatus] as RecordingState;
      runInAction(() => {
        this.status = state === 'recording' ? 'active' : state === 'paused' ? 'paused' : 'idle';
        this.timestamp = result[StorageConfig.RecorderTimestamp] ?? 0;
      });
      if (this.status === 'active') this.__startTimer();
    } catch (error) {
      console.log('Error setting up state from storage', error);
    } finally {
      runInAction(() => {
        this.initialized = true;
      });
    }
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

      case EventConfig.CloseExtension: {
        const node = document.getElementById(RECORDER_ROOT);
        if (node) node.remove();
        break;
      }

      case EventConfig.StartStreamCaptureError: {
        runInAction(() => (this.status = 'error'));
        this.__stopTimer(true);
        toast.error(unwrapError(message.payload.error, 'Something went wrong while starting your recording.'));
        break;
      }

      case EventConfig.SaveCapturedStreamSuccess: {
        runInAction(() => (this.status = 'idle'));
        toast.success('Your recording has been saved to your downloads folder.');
        break;
      }

      case EventConfig.SaveCapturedStreamError: {
        runInAction(() => (this.status = 'error'));
        toast.error(unwrapError(message.payload.error, 'Something went wrong while saving your recording.'));
        break;
      }
    }
  }

  /**
   * Comment out during development
   */
  private __setupEvents() {
    chrome.runtime.onMessage.addListener(this._runtimeEvents);
  }

  startScreenCapture() {
    this.status = 'countdown';

    this._timeout = setTimeout(() => {
      runInAction(() => {
        this.status = 'pending';
      });

      setTimeout(() => {
        chrome.runtime.sendMessage({
          type: EventConfig.StartDisplayStreamCapture,
          payload: { microphoneId: microphone.device, captureDeviceAudio: this.audio, pushToTalk: microphone.pushToTalk },
        });
      }, 0);
    }, RECORD_TIMEOUT * 1000);
  }

  saveScreenCapture() {
    this.status = 'saving';
    chrome.runtime.sendMessage({ type: EventConfig.SaveCapturedStream });
    this.__stopTimer(true);
  }

  cancelScreenCapture() {
    this.status = 'idle';
    chrome.runtime.sendMessage({ type: EventConfig.DiscardStreamCapture });
    if (this._timeout) clearTimeout(this._timeout);
  }

  discardScreenCapture() {
    this.status = 'idle';
    chrome.runtime.sendMessage({ type: EventConfig.DiscardStreamCapture });
    this.__stopTimer(true);
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

  changeDesktopAudio(audio?: boolean) {
    this.audio = isUndefined(audio) ? !this.audio : audio;
  }
}

const recorder = Recorder.createInstance();

export { recorder, Recorder };
