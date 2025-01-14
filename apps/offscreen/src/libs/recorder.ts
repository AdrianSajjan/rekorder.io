import exportWebmBlob from 'fix-webm-duration';
import { nanoid } from 'nanoid';

import { RecorderSurface } from '@rekorder.io/types';
import { ExtensionOfflineDatabase } from '@rekorder.io/database';
import { EventConfig, StorageConfig } from '@rekorder.io/constants';

import { DEFAULT_MIME_TYPE, MIME_TYPES } from '../constants/mime-types';

interface OffscreenRecorderStart {
  streamId?: string;
  microphoneId: string;
  captureDeviceAudio: boolean;
  pushToTalk: boolean;
  surface: RecorderSurface;
}

class OffscreenRecorder {
  chunks: Blob[];
  muted: boolean;
  timestamp: number;
  discard: boolean;

  streamId: string;
  microphoneId: string;
  captureDeviceAudio: boolean;
  displaySurface: RecorderSurface;

  audio: MediaStream | null;
  video: MediaStream | null;
  stream: MediaStream | null;
  recorder: MediaRecorder | null;

  recordingState: RecordingState;
  timerInterval: NodeJS.Timer | null;
  timerCountdown: NodeJS.Timeout | null;
  helperAudioContext: AudioContext | null;
  offlineDatabase: ExtensionOfflineDatabase;

  constructor() {
    this.chunks = [];
    this.timestamp = 0;
    this.muted = false;
    this.discard = false;

    this.streamId = '';
    this.microphoneId = 'n/a';
    this.displaySurface = 'tab';
    this.captureDeviceAudio = false;

    this.video = null;
    this.audio = null;
    this.stream = null;
    this.recorder = null;

    this.timerInterval = null;
    this.timerCountdown = null;
    this.helperAudioContext = null;
    this.recordingState = 'inactive';
    this.offlineDatabase = ExtensionOfflineDatabase.createInstance();
  }

  static createInstance() {
    return new OffscreenRecorder();
  }

  private __setSessionStorage(data: Record<string, unknown>) {
    chrome.runtime.sendMessage({ type: EventConfig.SetSessionStorage, payload: data });
  }

  private __resetSessionStorage() {
    this.__setSessionStorage({ [StorageConfig.RecorderStatus]: this.recordingState, [StorageConfig.RecorderTimestamp]: this.timestamp });
  }

  private __resetState() {
    if (this.video) this.video.getTracks().forEach((track) => track.stop());
    if (this.audio) this.audio.getTracks().forEach((track) => track.stop());
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());

    if (this.helperAudioContext) this.helperAudioContext.close();
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.chunks = [];
    this.timestamp = 0;
    this.discard = false;

    this.streamId = '';
    this.microphoneId = 'n/a';
    this.captureDeviceAudio = false;

    this.video = null;
    this.audio = null;
    this.stream = null;
    this.recorder = null;

    this.timerInterval = null;
    this.helperAudioContext = null;
    this.recordingState = 'inactive';
    this.__resetSessionStorage();
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

  private __preventTabSilence(media: MediaStream) {
    if (!this.captureDeviceAudio || !media.getAudioTracks().length) return;

    this.helperAudioContext = new AudioContext();
    const source = this.helperAudioContext.createMediaStreamSource(media);
    source.connect(this.helperAudioContext.destination);
  }

  /**
   * Save the blob to the offline database and send the uuid and id back to the content script
   */
  private async __exportWebmBlob(blob: Blob) {
    try {
      const uuid = nanoid();
      const id = await this.offlineDatabase.blobs.add({
        uuid: uuid,
        name: 'Untitled Recording - ' + new Date().toLocaleString().split(',')[0],
        duration: this.timestamp,
        original: blob,
        modified: null,
        created_at: Date.now(),
        updated_at: null,
      });
      chrome.runtime.sendMessage({ type: EventConfig.SaveCapturedStreamSuccess, payload: { uuid, id } });
    } catch (error) {
      console.warn('Error in offscreen recorder while saving captured stream to offline database', error);
      chrome.runtime.sendMessage({ type: EventConfig.SaveCapturedStreamError, payload: { error } });
    } finally {
      this.__resetState();
    }
  }

  private __recorderStopEvent() {
    if (this.discard) {
      this.__resetState();
      chrome.runtime.sendMessage({ type: EventConfig.DiscardStreamCaptureSuccess, payload: null });
    } else {
      const blob = new Blob(this.chunks, { type: 'video/webm' });
      exportWebmBlob(blob, this.timestamp, (blob) => this.__exportWebmBlob(blob), { logger: false });
    }
  }

  private __recorderDataAvailableEvent(event: BlobEvent) {
    if (event.data.size > 0) {
      this.chunks.push(event.data);
    }
  }

  private __recorderStartEvent() {
    this.__startTimer();
    this.recordingState = 'recording';
    chrome.runtime.sendMessage({ type: EventConfig.StartStreamCaptureSuccess, payload: null });
    this.__setSessionStorage({ [StorageConfig.RecorderStatus]: this.recordingState });
  }

  private __recorderPauseEvent() {
    this.__stopTimer();
    this.recordingState = 'paused';
    chrome.runtime.sendMessage({ type: EventConfig.PauseStreamCaptureSuccess, payload: null });
    this.__setSessionStorage({ [StorageConfig.RecorderStatus]: this.recordingState });
  }

  private __recorderResumeEvent() {
    this.__startTimer();
    this.recordingState = 'recording';
    chrome.runtime.sendMessage({ type: EventConfig.ResumeStreamCaptureSuccess, payload: null });
    this.__setSessionStorage({ [StorageConfig.RecorderStatus]: this.recordingState });
  }

  private __recorderErrorEvent(error: unknown) {
    this.__resetState();
    chrome.runtime.sendMessage({ type: EventConfig.StartStreamCaptureError, payload: { error } });
    console.warn('Error in recorder while recording stream', error);
  }

  private __captureStreamError(error: unknown) {
    this.__resetState();
    chrome.runtime.sendMessage({ type: EventConfig.StartStreamCaptureError, payload: { error } });
    console.warn('Error in recorder while capturing stream', error);
  }

  private __captureStreamSuccess() {
    if (!this.video) return;

    const combined = [...this.video.getTracks(), ...(this.audio ? this.audio.getTracks() : [])];
    const mimeType = MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? DEFAULT_MIME_TYPE;

    this.stream = new MediaStream(combined);
    this.recorder = new MediaRecorder(this.stream, { mimeType, videoBitsPerSecond: 2500000, audioBitsPerSecond: 128000 });

    this.recorder.addEventListener('stop', this.__recorderStopEvent.bind(this));
    this.recorder.addEventListener('error', this.__recorderErrorEvent.bind(this));
    this.recorder.addEventListener('start', this.__recorderStartEvent.bind(this));
    this.recorder.addEventListener('pause', this.__recorderPauseEvent.bind(this));
    this.recorder.addEventListener('resume', this.__recorderResumeEvent.bind(this));
    this.recorder.addEventListener('dataavailable', this.__recorderDataAvailableEvent.bind(this));

    this.__preventTabSilence(this.video);
    this.timerCountdown = setTimeout(() => {
      this.recorder!.start(100);
      this.timerCountdown = null;
    }, 300); // Start the recorder after a short time to prevent screen jerk from the "Screen Capture banner"
  }

  private async __captureDisplayVideoStream() {
    if (this.displaySurface === 'tab') {
      if (!this.streamId) {
        throw new Error('Selected display surface is tab, but unable to obtain a media stream id');
      }

      this.video = await navigator.mediaDevices.getUserMedia({
        audio: this.captureDeviceAudio ? { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: this.streamId } } : false,
        video: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: this.streamId, maxFrameRate: 30 } },
      } as MediaStreamConstraints);
    } else {
      this.video = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: this.displaySurface },
        audio: this.captureDeviceAudio,
      } as DisplayMediaStreamOptions);
    }

    if (!this.video.getVideoTracks().length) {
      throw new Error(`No video tracks found in the created display media stream: ${this.streamId}`);
    }

    if (this.captureDeviceAudio && !this.video.getAudioTracks().length) {
      throw new Error(`No audio tracks found in the created display media stream: ${this.streamId}`);
    }
  }

  private async __captureUserMicrophoneAudio() {
    if (!this.microphoneId || this.microphoneId === 'n/a') return;

    this.audio = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: this.microphoneId },
    });

    if (!this.audio.getAudioTracks().length) {
      throw new Error(`No audio tracks found in the created audio media stream: ${this.microphoneId}`);
    }

    if (this.muted) {
      this.audio.getAudioTracks().forEach((track) => (track.enabled = false));
    }
  }

  async start({ captureDeviceAudio, microphoneId, pushToTalk, surface, streamId = '' }: OffscreenRecorderStart) {
    this.muted = pushToTalk;
    this.streamId = streamId;
    this.displaySurface = surface;
    this.microphoneId = microphoneId;
    this.captureDeviceAudio = captureDeviceAudio;

    const promises = [this.__captureDisplayVideoStream(), this.__captureUserMicrophoneAudio()];
    const results = await Promise.allSettled(promises);
    const index = results.findIndex((result) => result.status === 'rejected');

    if (index === -1) {
      this.__captureStreamSuccess();
    } else {
      const error = results[index] as PromiseRejectedResult;
      this.__captureStreamError(error.reason);
    }
  }

  stop() {
    this.recorder?.stop();
  }

  delete() {
    this.discard = true;
    this.stop();
  }

  cancel() {
    if (this.timerCountdown) {
      clearTimeout(this.timerCountdown);
      this.timerCountdown = null;
    } else {
      this.delete();
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

  mute(muted: boolean) {
    this.muted = muted;
    this.audio?.getTracks().forEach((track) => (track.enabled = !muted));
  }
}

const recorder = OffscreenRecorder.createInstance();

export { OffscreenRecorder, recorder };
