import { toast } from 'sonner';
import { makeAutoObservable, runInAction } from 'mobx';
import { isUndefined } from 'lodash';

import { unwrapError } from '@rekorder.io/utils';
import { EventConfig, RecorderConfig, StorageConfig } from '@rekorder.io/constants';
import { RecorderSurface, RuntimeMessage } from '@rekorder.io/types';

import { microphone } from './microphone';
import { formatTime } from '../lib/utils';

type RecorderStatus = 'idle' | 'countdown' | 'pending' | 'active' | 'paused' | 'saving' | 'error';

class Recorder {
  audio: boolean;
  timestamp: number;
  initialized: boolean;

  status: RecorderStatus;
  surface: RecorderSurface;

  private _interval: NodeJS.Timer | null;
  private _timeout: NodeJS.Timeout | null;
  private _runtimeEvents = this.__runtimeEvents.bind(this);

  constructor() {
    this.initialized = false;
    this.status = 'idle';

    this.audio = true;
    this.timestamp = 0;
    this.surface = 'tab';

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
    return formatTime(this.timestamp);
  }

  private async __setupState() {
    if (import.meta.env.DEV) {
      runInAction(() => {
        this.initialized = true;
      });
    } else {
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
        runInAction(() => (this.status = 'countdown'));
        setTimeout(() => {
          runInAction(() => (this.status = 'pending'));
          setTimeout(() => chrome.runtime.sendMessage({ type: EventConfig.StartStreamRecording }), RecorderConfig.TimerOffsetMs);
        }, RecorderConfig.TimerCountdownMs);
        break;
      }

      case EventConfig.StartStreamRecordingSuccess: {
        this.__startTimer();
        runInAction(() => (this.status = 'active'));
        break;
      }

      case EventConfig.StartStreamCaptureError:
      case EventConfig.StartStreamRecordingError: {
        this.__stopTimer(true);
        runInAction(() => (this.status = 'error'));
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

  private __setupEvents() {
    if (import.meta.env.DEV) return;
    chrome.runtime.onMessage.addListener(this._runtimeEvents);
  }

  private __resetEvents() {
    if (import.meta.env.DEV) return;
    chrome.runtime.onMessage.removeListener(this._runtimeEvents);
  }

  startScreenCapture() {
    chrome.runtime.sendMessage({
      type: this.surface !== 'tab' ? EventConfig.StartDisplayStreamCapture : EventConfig.StartTabStreamCapture,
      payload: {
        surface: this.surface,
        countdownEnabled: true,
        microphoneId: microphone.device,
        captureDeviceAudio: this.audio,
        pushToTalk: microphone.pushToTalk,
      },
    });
  }

  saveScreenCapture() {
    this.status = 'saving';
    chrome.runtime.sendMessage({ type: EventConfig.SaveCapturedStream });
    this.__stopTimer(true);
  }

  cancelScreenCapture() {
    this.status = 'idle';
    chrome.runtime.sendMessage({ type: EventConfig.CancelStreamCapture });
    if (this._timeout) clearTimeout(this._timeout);
    this._timeout = null;
  }

  skipCaptureCountdown() {
    this.status = 'pending';
    setTimeout(() => chrome.runtime.sendMessage({ type: EventConfig.StartStreamRecording }), RecorderConfig.TimerOffsetMs);
    if (this._timeout) clearTimeout(this._timeout);
    this._timeout = null;
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

  changeDisplaySurface(surface: RecorderSurface) {
    this.surface = surface;
  }

  dispose() {
    this.__resetEvents();
  }
}

const recorder = Recorder.createInstance();

export { recorder, Recorder };
