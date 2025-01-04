import { makeAutoObservable, runInAction } from 'mobx';
import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { BlobStorage, ExtensionOfflineDatabase } from '@rekorder.io/utils';

class Editor {
  video: BlobStorage | null;
  blobURL: string | null;

  private _offlineDatabase: ExtensionOfflineDatabase;
  private _runtimeEventHandler = this.__runtimeEventHandler.bind(this);

  constructor() {
    this.video = null;
    this.blobURL = null;
    this._offlineDatabase = ExtensionOfflineDatabase.createInstance();

    this.__setupEvents();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private async __runtimeEventHandler(message: RuntimeMessage) {
    console.log('Runtime event handler received message:', message);

    switch (message.type) {
      case EventConfig.InitializeEditor: {
        const blob = await this._offlineDatabase.blobs.get(message.payload.id);
        console.log('Blob:', blob);
        if (blob) {
          runInAction(() => {
            this.video = blob;
            this.blobURL = URL.createObjectURL(this.video.blob);
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
