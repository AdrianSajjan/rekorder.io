import { nanoid } from 'nanoid';

import { EventConfig, StorageConfig } from '@rekorder.io/constants';
import { ExtensionOfflineDatabase } from '@rekorder.io/database';
import { RecorderSurface, RuntimeMessage } from '@rekorder.io/types';
import { assert, waitUnitWorkerEvent } from '@rekorder.io/utils';

import { ScreenRecorderEvents } from '../constants/events';

type SaveStreamBuffer = Record<'webm' | 'mp4', ArrayBuffer>;

interface OffscreenRecorderStart {
  streamId?: string;
  microphoneId: string;

  countdownEnabled: boolean;
  captureDeviceAudio: boolean;

  pushToTalk: boolean;
  surface: RecorderSurface;
}

interface ChromeLocalStorage {
  [key: string]: any;
}

class OffscreenRecorder {
  muted: boolean;
  timestamp: number;
  streamId: string;
  microphoneId: string;
  displaySurface: RecorderSurface;

  captureDeviceAudio: boolean;
  countdownEnabled: boolean;
  recordingState: RecordingState;

  audio: MediaStream | null;
  video: MediaStream | null;
  context: AudioContext | null;
  destination: MediaStreamAudioDestinationNode | null;

  worker: Worker;
  offlineDatabase: ExtensionOfflineDatabase;
  timerInterval: NodeJS.Timer | null;

  private readonly mSampleRate = 48000;

  constructor() {
    this.timestamp = 0;
    this.muted = false;
    this.streamId = '';
    this.microphoneId = 'n/a';
    this.displaySurface = 'tab';

    this.countdownEnabled = true;
    this.captureDeviceAudio = true;
    this.recordingState = 'inactive';

    this.video = null;
    this.audio = null;
    this.context = null;
    this.destination = null;

    this.timerInterval = null;
    this.worker = this.__setupWorker();
    this.offlineDatabase = ExtensionOfflineDatabase.createInstance();
  }

  static createInstance() {
    return new OffscreenRecorder();
  }

  private get videoTrack() {
    return this.video?.getVideoTracks()[0];
  }

  private get audioTrack() {
    return this.destination?.stream.getAudioTracks()[0];
  }

  private __setSessionStorage(data: Record<string, unknown>) {
    chrome.runtime.sendMessage({ type: EventConfig.SetSessionStorage, payload: data });
  }

  private __resetSessionStorage() {
    this.__setSessionStorage({ [StorageConfig.RecorderStatus]: this.recordingState, [StorageConfig.RecorderTimestamp]: this.timestamp });
  }

  private __getLocalStorage(keys?: string | number | (string | number)[]) {
    return new Promise<ChromeLocalStorage>((resolve, reject) => {
      chrome.runtime.sendMessage({ type: EventConfig.GetLocalStorage, payload: keys }, (response: RuntimeMessage) => {
        switch (response.type) {
          case EventConfig.GetLocalStorageSuccess:
            resolve(response.payload);
            break;
          case EventConfig.GetLocalStorageError:
            reject(response.payload);
            break;
        }
      });
    });
  }

  private async __initialize() {
    const result = await this.__getLocalStorage([
      StorageConfig.AudioMuted,
      StorageConfig.AudioDeviceId,
      StorageConfig.DisplaySurface,
      StorageConfig.AudioPushToTalk,
      StorageConfig.CountdownEnabled,
      StorageConfig.DesktopAudioEnabled,
    ]);
    this.microphoneId = result[StorageConfig.AudioDeviceId] ?? 'n/a';
    this.displaySurface = result[StorageConfig.DisplaySurface] ?? 'tab';
    this.countdownEnabled = result[StorageConfig.CountdownEnabled] ?? true;
    this.captureDeviceAudio = result[StorageConfig.DesktopAudioEnabled] ?? true;
    this.muted = result[StorageConfig.AudioMuted] ?? result[StorageConfig.AudioPushToTalk] ?? false;
  }

  private __resetState() {
    if (this.video) this.video.getTracks().forEach((track) => track.stop());
    if (this.audio) this.audio.getTracks().forEach((track) => track.stop());
    if (this.destination) this.destination.stream.getTracks().forEach((track) => track.stop());
    if (this.context) this.context.close();
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.streamId = '';
    this.timestamp = 0;
    this.microphoneId = 'n/a';
    this.captureDeviceAudio = false;
    this.recordingState = 'inactive';

    this.video = null;
    this.audio = null;
    this.context = null;
    this.destination = null;
    this.timerInterval = null;

    this.__resetSessionStorage();
  }

  private __setupWorker() {
    return new Worker(new URL('../worker/recorder.ts', import.meta.url));
  }

  private async __saveBlob(blob: Blob) {
    const uuid = nanoid();
    const name = 'Untitled Recording - ' + new Date().toLocaleString().split(',')[0];
    const id = await this.offlineDatabase.blobs.add({ uuid, name, original_blob: blob, modified_blob: null, created_at: Date.now(), updated_at: null });
    chrome.runtime.sendMessage({ type: EventConfig.SaveCapturedStreamSuccess, payload: { uuid, id } });
  }

  private __startTimer() {
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this.timestamp += 1;
        this.__setSessionStorage({ [StorageConfig.RecorderTimestamp]: this.timestamp });
      }, 1000);
    }
  }

  private __stopTimer(reset?: boolean) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
    if (reset) {
      this.timestamp = 0;
      this.__setSessionStorage({ [StorageConfig.RecorderTimestamp]: this.timestamp });
    }
  }

  private async __initializeWorkerStream() {
    assert(this.videoTrack);

    const videoTrackSettings = this.videoTrack.getSettings();
    const videoReadableStream = new MediaStreamTrackProcessor({ track: this.videoTrack }).readable;

    if (!this.audioTrack) {
      this.worker.postMessage(
        {
          type: ScreenRecorderEvents.CaptureStream,
          payload: { videoTrackSettings, videoReadableStream },
        },
        [videoReadableStream]
      );

      await waitUnitWorkerEvent(this.worker, {
        success: ScreenRecorderEvents.CaptureStreamSuccess,
        error: ScreenRecorderEvents.CaptureStreamError,
      });
    } else {
      const audioTrackSettings = this.audioTrack.getSettings();
      const audioReadableStream = new MediaStreamTrackProcessor({ track: this.audioTrack }).readable;

      this.worker.postMessage(
        {
          type: ScreenRecorderEvents.CaptureStream,
          payload: { videoTrackSettings, videoReadableStream, audioTrackSettings, audioReadableStream },
        },
        [videoReadableStream, audioReadableStream]
      );

      await waitUnitWorkerEvent(this.worker, {
        success: ScreenRecorderEvents.CaptureStreamSuccess,
        error: ScreenRecorderEvents.CaptureStreamError,
      });
    }
  }

  private __initializeAudioMixing() {
    const desktopAudio = this.video?.getAudioTracks()[0];
    const microphoneAudio = this.audio?.getAudioTracks()[0];

    const desktopSampleRate = desktopAudio?.getSettings().sampleRate || this.mSampleRate;
    const microphoneSampleRate = microphoneAudio?.getSettings().sampleRate || this.mSampleRate;
    const sampleRate = Math.min(this.mSampleRate, desktopSampleRate, microphoneSampleRate);

    this.context = new AudioContext({ sampleRate });
    this.destination = this.context.createMediaStreamDestination();

    if (desktopAudio) {
      const desktopSource = this.context.createMediaStreamSource(new MediaStream([desktopAudio]));
      const desktopGain = this.context.createGain();
      desktopGain.gain.value = 0.7;
      desktopSource.connect(desktopGain).connect(this.destination);
    }

    if (microphoneAudio) {
      const microphoneSource = this.context.createMediaStreamSource(new MediaStream([microphoneAudio]));
      const microphoneGain = this.context.createGain();
      microphoneGain.gain.value = 1.0;
      microphoneSource.connect(microphoneGain).connect(this.destination);
    }
  }

  private __captureStreamError(error: unknown) {
    this.__resetState();
    chrome.runtime.sendMessage({ type: EventConfig.StartStreamCaptureError, payload: { error } });
    console.log('Error in navigator while capturing stream', error);
  }

  private async __captureStreamSuccess() {
    if (this.video) {
      this.__initializeAudioMixing();
      await this.__initializeWorkerStream();
      chrome.runtime.sendMessage({ type: EventConfig.StartStreamCaptureSuccess, payload: null });
    }
  }

  private async __captureDisplayVideoStream() {
    switch (this.displaySurface) {
      case 'tab':
        if (!this.streamId) {
          throw new Error('Selected display surface is tab, but unable to obtain a media stream id');
        }
        this.video = await navigator.mediaDevices.getUserMedia({
          audio: this.captureDeviceAudio ? { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: this.streamId } } : false,
          video: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: this.streamId, maxFrameRate: 30 } },
        } as MediaStreamConstraints);
        break;

      default:
        this.video = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: this.displaySurface },
          audio: this.captureDeviceAudio,
        } as DisplayMediaStreamOptions);
        break;
    }
  }

  private async __captureUserMicrophoneAudio() {
    if (!this.microphoneId || this.microphoneId === 'n/a') return;

    this.audio = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: this.microphoneId },
    });

    if (this.muted) {
      this.audio.getAudioTracks().forEach((track) => (track.enabled = false));
    }
  }

  capture({ streamId = '' }: OffscreenRecorderStart) {
    this.__initialize().then(
      () => {
        this.streamId = streamId;
        const promises = [this.__captureDisplayVideoStream(), this.__captureUserMicrophoneAudio()];
        Promise.all(promises).then(this.__captureStreamSuccess.bind(this)).catch(this.__captureStreamError.bind(this));
      },
      (error) => {
        this.__captureStreamError(error);
      }
    );
  }

  async start() {
    if (this.recordingState === 'recording') return;

    try {
      this.worker.postMessage({ type: ScreenRecorderEvents.RecordStream });
      await waitUnitWorkerEvent(this.worker, { success: ScreenRecorderEvents.RecordStreamSuccess, error: ScreenRecorderEvents.RecordStreamError });
      this.recordingState = 'recording';

      this.__startTimer();
      chrome.runtime.sendMessage({ type: EventConfig.StartStreamRecordingSuccess, payload: null });
      this.__setSessionStorage({ [StorageConfig.RecorderStatus]: this.recordingState });
    } catch (error) {
      console.log('Error in offscreen recorder while starting stream recording', error);
      chrome.runtime.sendMessage({ type: EventConfig.StartStreamRecordingError, payload: { error } });
    }
  }

  async stop() {
    try {
      this.__resetState();
      this.worker.postMessage({ type: ScreenRecorderEvents.SaveStream });

      const buffer = await waitUnitWorkerEvent<SaveStreamBuffer>(this.worker, { success: ScreenRecorderEvents.SaveStreamSuccess, error: ScreenRecorderEvents.SaveStreamError });
      const blob = new Blob([buffer.mp4], { type: 'video/mp4' });
      this.__saveBlob(blob);
    } catch (error) {
      console.log('Error in offscreen recorder while stopping stream recording', error);
      chrome.runtime.sendMessage({ type: EventConfig.SaveCapturedStreamError, payload: { error } });
    }
  }

  async delete() {
    try {
      this.__resetState();
      this.worker.postMessage({ type: ScreenRecorderEvents.DiscardStream });

      await waitUnitWorkerEvent(this.worker, { success: ScreenRecorderEvents.DiscardStreamSuccess, error: ScreenRecorderEvents.DiscardStreamError });
      this.recordingState = 'inactive';
      chrome.runtime.sendMessage({ type: EventConfig.DiscardStreamCaptureSuccess, payload: null });
    } catch (error) {
      console.log('Error in offscreen recorder while discarding stream recording', error);
      chrome.runtime.sendMessage({ type: EventConfig.DiscardStreamCaptureError, payload: { error } });
    }
  }

  async pause() {
    if (this.recordingState !== 'recording') return;

    try {
      this.__stopTimer();
      this.worker.postMessage({ type: ScreenRecorderEvents.PauseStream });

      await waitUnitWorkerEvent(this.worker, { success: ScreenRecorderEvents.PauseStreamSuccess, error: ScreenRecorderEvents.PauseStreamError });
      this.recordingState = 'paused';
    } catch (error) {
      console.log('Error in offscreen recorder while pausing stream recording', error);
      chrome.runtime.sendMessage({ type: EventConfig.PauseStreamCaptureError, payload: { error } });
    }
  }

  async resume() {
    if (this.recordingState !== 'paused') return;

    try {
      this.worker.postMessage({ type: ScreenRecorderEvents.ResumeStream });
      await waitUnitWorkerEvent(this.worker, { success: ScreenRecorderEvents.ResumeStreamSuccess, error: ScreenRecorderEvents.ResumeStreamError });

      this.__startTimer();
      this.recordingState = 'recording';
      chrome.runtime.sendMessage({ type: EventConfig.ResumeStreamCaptureSuccess, payload: null });
    } catch (error) {
      console.log('Error in offscreen recorder while resuming stream recording', error);
      chrome.runtime.sendMessage({ type: EventConfig.ResumeStreamCaptureError, payload: { error } });
    }
  }

  cancel() {
    this.__resetState();
  }

  mute(muted: boolean) {
    this.muted = muted;
    if (this.audio) this.audio.getTracks().forEach((track) => (track.enabled = !muted));
  }
}

const recorder = OffscreenRecorder.createInstance();

export { OffscreenRecorder, recorder };
