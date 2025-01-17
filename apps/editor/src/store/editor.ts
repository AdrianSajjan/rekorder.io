import { debounce } from 'lodash';
import { makeAutoObservable, runInAction } from 'mobx';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { BlobStorage, ExtensionOfflineDatabase } from '@rekorder.io/database';

type EditorStatus = 'idle' | 'pending' | 'initialized' | 'error';

class Editor {
  name: string;
  status: EditorStatus;

  blobURL: string | null;
  video: BlobStorage | null;

  private _ffmpeg: FFmpeg;
  private _offlineDatabase: ExtensionOfflineDatabase;

  private _runtimeEventHandler = this.__runtimeEventHandler.bind(this);
  private _saveNameOfflineDatabaseDebounced = debounce(this.__saveNameOfflineDatabase, 500);

  constructor() {
    this.name = '';
    this.status = 'idle';

    this.video = null;
    this.blobURL = null;

    this._ffmpeg = new FFmpeg();
    this._offlineDatabase = ExtensionOfflineDatabase.createInstance();

    this.__setupEvents();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private async __initializeFFmpeg() {
    this.status = 'pending';
    try {
      const base = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm';
      await this._ffmpeg.load({
        coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'application/javascript'),
        wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      this.status = 'initialized';
    } catch (error) {
      this.status = 'error';
      console.log('Failed to initialize FFmpeg', error);
    }
  }

  private __saveNameOfflineDatabase(name: string) {
    if (this.video) {
      console.log('Saving name to offline database', name);
      this._offlineDatabase.blobs.update(this.video.id, { name });
    }
  }

  private async __runtimeEventHandler(message: RuntimeMessage) {
    switch (message.type) {
      case EventConfig.InitializeEditor: {
        const blob = await this._offlineDatabase.blobs.get(message.payload.id);
        if (blob) {
          runInAction(() => {
            this.video = blob;
            this.name = blob.name;
            this.blobURL = URL.createObjectURL(blob.original_blob);
          });
        }
        break;
      }
    }
  }

  private __setupEvents() {
    if (import.meta.env.DEV) return;
    chrome.runtime.onMessage.addListener(this._runtimeEventHandler);
  }

  static createInstance() {
    return new Editor();
  }

  updateName(name: string) {
    this.name = name;
    this._saveNameOfflineDatabaseDebounced(name);
  }

  dispose() {
    if (this.blobURL) URL.revokeObjectURL(this.blobURL);
    if (!import.meta.env.DEV) chrome.runtime.onMessage.removeListener(this._runtimeEventHandler);

    this.video = null;
    this.blobURL = null;
  }
}

const editor = Editor.createInstance();

export { editor, Editor };
