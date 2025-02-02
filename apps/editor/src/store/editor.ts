import { debounce } from 'lodash';
import { nanoid } from 'nanoid';
import { makeAutoObservable, runInAction } from 'mobx';
import { FFmpeg, LogEvent, ProgressEvent } from '@ffmpeg/ffmpeg';

import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { BlobStorage, ExtensionOfflineDatabase } from '@rekorder.io/database';
import { Cropper } from './cropper';

export type EditorStatus = 'idle' | 'pending' | 'initialized' | 'error';
export type SidebarMode = 'default' | 'crop' | 'audio';
export type FooterMode = 'none' | 'audio' | 'trim';

class Editor {
  name: string;
  sidebar: SidebarMode;
  status: EditorStatus;

  video: BlobStorage | null;
  element: HTMLVideoElement | null;

  ffmpeg: FFmpeg;
  cropper: Cropper;

  originalMp4: Blob | null;
  modifiedMp4: Blob | null;
  originalWebm: Blob | null;
  modifiedWebm: Blob | null;

  private _offlineDatabase: ExtensionOfflineDatabase;
  private _saveNameOfflineDatabaseDebounced = debounce(this.__saveNameOfflineDatabase, 500);

  private _ffmpegLogsHandler = this.__ffmpegLogsHandler.bind(this);
  private _runtimeEventHandler = this.__runtimeEventHandler.bind(this);
  private _ffmpegProgressHandler = this.__ffmpegProgressHandler.bind(this);

  constructor() {
    this.name = '';
    this.sidebar = 'default';
    this.status = 'initialized';

    this.video = null;
    this.element = null;

    this.originalMp4 = null;
    this.modifiedMp4 = null;
    this.originalWebm = null;
    this.modifiedWebm = null;

    this.ffmpeg = new FFmpeg();
    this.cropper = new Cropper(this);
    this._offlineDatabase = ExtensionOfflineDatabase.createInstance();

    this.__setupEvents();
    this.__initializeState();

    makeAutoObservable(this, {}, { autoBind: true });
  }

  get mp4Recording() {
    if (this.modifiedMp4) return this.modifiedMp4;
    return this.originalMp4;
  }

  get webmRecording() {
    if (this.modifiedWebm) return this.modifiedWebm;
    return this.originalWebm;
  }

  get mp4RecordingOrThrow() {
    if (!this.mp4Recording) throw new Error('No recording file found');
    return this.mp4Recording;
  }

  get webmRecordingOrThrow() {
    if (!this.webmRecording) throw new Error('No recording file found');
    return this.webmRecording;
  }

  get elementOrThrow() {
    if (!this.element) throw new Error('No element found');
    return this.element;
  }

  get footer(): FooterMode {
    switch (this.sidebar) {
      case 'audio':
        return 'audio';
      default:
        return 'none';
    }
  }

  private async __initializeState() {
    if (!import.meta.env.DEV) return;
    fetch('http://localhost:54321/storage/v1/object/public/assets/videos/sample.webm')
      .then((response) => response.blob())
      .then((blob) => {
        runInAction(() => {
          const uuid = nanoid();
          this.name = 'Big Buck Bunny';
          this.video = { id: 1, uuid, name: this.name, original_mp4: blob, modified_mp4: null, original_webm: blob, modified_webm: null, created_at: Date.now(), updated_at: null } as BlobStorage;
          this.originalMp4 = blob;
          this.originalWebm = blob;
        });
      });
  }

  private __saveNameOfflineDatabase(name: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Circular dependency error
    if (this.video) this._offlineDatabase.blobs.update(this.video.id, { name });
  }

  private async __runtimeEventHandler(message: RuntimeMessage) {
    switch (message.type) {
      case EventConfig.InitializeEditor: {
        const blob = await this._offlineDatabase.blobs.get(message.payload.id);
        if (blob) {
          runInAction(() => {
            this.video = blob;
            this.name = blob.name;
            this.originalMp4 = blob.original_mp4;
            this.modifiedMp4 = blob.modified_mp4;
            this.originalWebm = blob.original_webm;
            this.modifiedWebm = blob.modified_webm;
          });
        }
        break;
      }
    }
  }

  private __ffmpegProgressHandler(event: ProgressEvent) {
    console.log('Time:', event.time, 'Progress:', event.progress);
  }

  private __ffmpegLogsHandler(event: LogEvent) {
    console.log('Log:', event.message, event.type);
  }

  private __setupEvents() {
    this.ffmpeg.on('log', this._ffmpegLogsHandler);
    this.ffmpeg.on('progress', this._ffmpegProgressHandler);
    if (!import.meta.env.DEV) chrome.runtime.onMessage.addListener(this._runtimeEventHandler);
  }

  private __removeEvents() {
    this.ffmpeg.off('log', this._ffmpegLogsHandler);
    this.ffmpeg.off('progress', this._ffmpegProgressHandler);
    if (!import.meta.env.DEV) chrome.runtime.onMessage.removeListener(this._runtimeEventHandler);
  }

  static createInstance() {
    return new Editor();
  }

  async initializeFFmpeg() {
    await this.ffmpeg.load({
      coreURL: import.meta.env.DEV ? 'http://localhost:4300/build/vendor/ffmpeg/core.js' : chrome.runtime.getURL('build/vendor/ffmpeg/core.js'),
      wasmURL: import.meta.env.DEV ? 'http://localhost:4300/build/vendor/ffmpeg/core.wasm' : chrome.runtime.getURL('build/vendor/ffmpeg/core.wasm'),
    });
  }

  modifyRecording(mp4: Blob, webm: Blob) {
    this.modifiedMp4 = mp4;
    this.modifiedWebm = webm;
  }

  initializeElement(element: HTMLVideoElement) {
    this.element = element;
  }

  changeSidebar(sidebar: SidebarMode) {
    this.sidebar = sidebar;
  }

  changeName(name: string) {
    this.name = name;
    this._saveNameOfflineDatabaseDebounced(name);
  }

  dispose() {
    this.__removeEvents();
    this.video = null;
  }
}

const editor = Editor.createInstance();

export { editor, Editor };
