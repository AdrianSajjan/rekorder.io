import { debounce } from 'lodash';
import { nanoid } from 'nanoid';
import { makeAutoObservable, runInAction } from 'mobx';

import { FFmpeg, LogEvent, ProgressEvent } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { BlobStorage, ExtensionOfflineDatabase } from '@rekorder.io/database';

export type EditorStatus = 'idle' | 'pending' | 'initialized' | 'error';
export type SidebarMode = 'default' | 'crop' | 'audio';

class Editor {
  name: string;
  status: EditorStatus;
  sidebar: SidebarMode;
  video: BlobStorage | null;

  ffmpeg: FFmpeg;
  original: Blob | null;
  modified: Blob | null;

  private _offlineDatabase: ExtensionOfflineDatabase;
  private _saveNameOfflineDatabaseDebounced = debounce(this.__saveNameOfflineDatabase, 500);

  private _ffmpegLogsHandler = this.__ffmpegLogsHandler.bind(this);
  private _runtimeEventHandler = this.__runtimeEventHandler.bind(this);
  private _ffmpegProgressHandler = this.__ffmpegProgressHandler.bind(this);

  constructor() {
    this.name = '';
    this.status = 'idle';
    this.sidebar = 'default';

    this.video = null;
    this.original = null;
    this.modified = null;

    this.ffmpeg = new FFmpeg();
    this._offlineDatabase = ExtensionOfflineDatabase.createInstance();

    this.__setupEvents();
    this.__initializeState();
    this.__initializeFFmpeg();

    makeAutoObservable(this, {}, { autoBind: true });
  }

  get recording() {
    if (this.modified) return this.modified;
    return this.original;
  }

  get recordingOrThrow() {
    if (!this.recording) throw new Error('No recording file found');
    return this.recording;
  }

  private async __initializeFFmpeg() {
    this.status = 'pending';
    try {
      const base = 'https://unpkg.com/@ffmpeg/core-mt@0.12.9/dist/esm';
      await this.ffmpeg.load({
        wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
        coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'application/javascript'),
        workerURL: await toBlobURL(`${base}/ffmpeg-core.worker.js`, 'text/javascript'),
      });
      this.status = 'initialized';
    } catch (error) {
      this.status = 'error';
      console.log('Failed to initialize FFmpeg', error);
    }
  }

  private async __initializeState() {
    if (!import.meta.env.DEV) return;
    const blobURL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4';
    fetch(blobURL)
      .then((response) => response.blob())
      .then((blob) => {
        runInAction(() => {
          this.name = 'Big Buck Bunny';
          this.video = { id: 1, uuid: nanoid(), name: this.name, original_blob: blob, modified_blob: null, created_at: Date.now(), updated_at: null } as BlobStorage;
          this.original = blob;
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

  async convertToMP4() {
    const input = await fetchFile(this.recordingOrThrow);
    this.ffmpeg.writeFile('input.webm', input);

    await this.ffmpeg.exec(['-i', 'input.webm', '-preset', 'ultrafast', '-c:v', 'libx264', '-c:a', 'aac', 'output.mp4']);
    const output = await this.ffmpeg.readFile('output.mp4');

    const data = output as Uint8Array;
    return new Blob([data.buffer], { type: 'video/mp4' });
  }

  changeName(name: string) {
    this.name = name;
    this._saveNameOfflineDatabaseDebounced(name);
  }

  changeSidebar(sidebar: SidebarMode) {
    this.sidebar = sidebar;
  }

  dispose() {
    this.__removeEvents();
    this.video = null;
  }
}

const editor = Editor.createInstance();

export { editor, Editor };
