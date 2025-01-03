import exportWebmBlob from 'fix-webm-duration';
import { EventConfig, StorageConfig } from '@rekorder.io/constants';
import { DEFAULT_MIME_TYPE, MIME_TYPES } from '../constants/mime-types';

class OffscreenRecorder {
  chunks: Blob[];
  muted: boolean;
  timestamp: number;
  discard: boolean;

  sourceId: string;
  microphoneId: string;
  captureDeviceAudio: boolean;

  audio: MediaStream | null;
  video: MediaStream | null;
  stream: MediaStream | null;
  recorder: MediaRecorder | null;

  recordingState: RecordingState;
  timerInterval: NodeJS.Timer | null;
  helperAudioContext: AudioContext | null;

  constructor() {
    this.chunks = [];
    this.timestamp = 0;
    this.muted = false;
    this.discard = false;

    this.sourceId = '';
    this.microphoneId = 'n/a';
    this.captureDeviceAudio = false;

    this.video = null;
    this.audio = null;
    this.stream = null;
    this.recorder = null;

    this.timerInterval = null;
    this.helperAudioContext = null;
    this.recordingState = 'inactive';
  }

  static createInstance() {
    return new OffscreenRecorder();
  }

  private __setSessionStorage(data: Record<string, unknown>) {
    chrome.runtime.sendMessage({ type: EventConfig.SetSessionStorage, payload: data });
  }

  // private __getSessionStorage(keys: string[]) {
  //   chrome.runtime.sendMessage({ type: EventConfig.GetSessionStorage, payload: keys }, (response) => {
  //     // TODO: handle response
  //   });
  // }

  private __resetStorage() {
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

    this.sourceId = '';
    this.microphoneId = 'n/a';
    this.captureDeviceAudio = false;

    this.video = null;
    this.audio = null;
    this.stream = null;
    this.recorder = null;

    this.timerInterval = null;
    this.helperAudioContext = null;
    this.recordingState = 'inactive';

    this.__resetStorage();
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
    if (this.captureDeviceAudio) {
      this.helperAudioContext = new AudioContext();
      const source = this.helperAudioContext.createMediaStreamSource(media);
      source.connect(this.helperAudioContext.destination);
    }
  }

  private __exportWebmBlob(blob: Blob) {
    this.__resetState();
    const url = URL.createObjectURL(blob);
    chrome.runtime.sendMessage({ type: EventConfig.SaveCapturedStreamSuccess, payload: { url } });
  }

  private __recorderStopEvent() {
    if (this.discard) {
      this.__resetState();
      chrome.runtime.sendMessage({ type: EventConfig.DiscardStreamCaptureSuccess, payload: null });
    } else {
      const blob = new Blob(this.chunks, { type: 'video/webm' });
      exportWebmBlob(blob, this.timestamp, this.__exportWebmBlob.bind(this), { logger: false });
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
    this.recorder.start(100);
  }

  private async __captureDisplayVideoStream() {
    this.video = await navigator.mediaDevices.getUserMedia({
      audio: this.captureDeviceAudio ? { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: this.sourceId } } : false,
      video: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: this.sourceId, maxFrameRate: 30 } },
    } as MediaStreamConstraints);
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

  async start(sourceId: string, microphoneId = 'n/a', captureDeviceAudio = false, pushToTalk = false) {
    this.muted = pushToTalk;
    this.sourceId = sourceId;
    this.microphoneId = microphoneId;
    this.captureDeviceAudio = captureDeviceAudio;

    const promises = [this.__captureDisplayVideoStream(), this.__captureUserMicrophoneAudio()];
    const results = await Promise.allSettled(promises);
    const index = results.findIndex((result) => result.status === 'rejected');

    if (index === -1) {
      this.__captureStreamSuccess();
    } else {
      const error = results[index] as unknown as PromiseRejectionEvent;
      this.__captureStreamError(error.reason);
    }
  }

  stop() {
    this.recorder?.stop();
  }

  cancel() {
    this.discard = true;
    this.stop();
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
