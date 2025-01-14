import { makeAutoObservable, runInAction } from 'mobx';
import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { BlobStorage, ExtensionOfflineDatabase } from '@rekorder.io/database';

class Editor {
  name: string;
  blobURL: string | null;
  video: BlobStorage | null;

  private _offlineDatabase: ExtensionOfflineDatabase;
  private _runtimeEventHandler = this.__runtimeEventHandler.bind(this);

  constructor() {
    this.name = '';
    this.video = null;
    this.blobURL = null;
    this._offlineDatabase = ExtensionOfflineDatabase.createInstance();

    this.__setupEvents();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private async __runtimeEventHandler(message: RuntimeMessage) {
    switch (message.type) {
      case EventConfig.InitializeEditor: {
        const blob = await this._offlineDatabase.blobs.get(message.payload.id);
        if (blob) {
          runInAction(() => {
            this.video = blob;
            this.name = blob.name;
            this.blobURL = URL.createObjectURL(blob.original);
          });
        }
        break;
      }
    }
  }

  /**
   * Comment out the runtime event listener during development
   */
  private __setupEvents() {
    chrome.runtime.onMessage.addListener(this._runtimeEventHandler);
  }

  static createInstance() {
    return new Editor();
  }

  updateName(name: string) {
    this.name = name;
  }

  /**
   * Comment out the runtime event listener during development
   */
  dispose() {
    chrome.runtime.onMessage.removeListener(this._runtimeEventHandler);
    if (this.blobURL) URL.revokeObjectURL(this.blobURL);

    this.video = null;
    this.blobURL = null;
  }
}

const editor = Editor.createInstance();

export { editor, Editor };
