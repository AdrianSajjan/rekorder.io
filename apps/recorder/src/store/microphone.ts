import { makeAutoObservable } from 'mobx';
import { clone } from '@rekorder.io/utils';
import { Autocomplete } from '@rekorder.io/types';
import { AudioConfig, EventConfig } from '@rekorder.io/constants';
import { checkPushToTalkActive, checkPushToTalkInactive } from '@rekorder.io/utils';

class Microphone {
  enabled: boolean;
  pushToTalk: boolean;
  device: Autocomplete<'n/a'>;
  status: 'idle' | 'pending' | 'initialized' | 'error';

  private _pushToTalkActive = false;

  constructor() {
    this.device = 'n/a';
    this.status = 'idle';
    this.enabled = true;
    this.pushToTalk = false;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Microphone();
  }

  private get _waveform() {
    const iframe = document.getElementById('rekorder-waveform-iframe') as HTMLIFrameElement | null;
    return iframe?.contentWindow ?? window;
  }

  private __setupEvents() {
    document.addEventListener('keydown', this.__handleKeyDown);
    document.addEventListener('keyup', this.__handleKeyUp);
  }

  private __removeEvents() {
    document.removeEventListener('keydown', this.__handleKeyDown);
    document.removeEventListener('keyup', this.__handleKeyUp);
  }

  private __handleKeyDown(event: KeyboardEvent) {
    if (checkPushToTalkActive(event) && !this._pushToTalkActive) {
      this._waveform.postMessage(clone({ type: EventConfig.AudioPushToTalkActive }), '*');
      this._pushToTalkActive = true;
    }
  }

  private __handleKeyUp(event: KeyboardEvent) {
    if (checkPushToTalkInactive(event) && this._pushToTalkActive) {
      this._waveform.postMessage(clone({ type: EventConfig.AudioPushToTalkInactive }), '*');
      this._pushToTalkActive = false;
    }
  }

  changeDevice(value: Autocomplete<'n/a'>) {
    this.device = value;
    chrome.storage.local.set({ [AudioConfig.DeviceId]: value });
    this._waveform.postMessage(clone({ type: EventConfig.AudioDevice, payload: { device: value } }), '*');
  }

  updateEnabled(value: boolean | 'toggle') {
    this.enabled = value === 'toggle' ? !this.enabled : value;
  }

  updatePushToTalk(value: boolean) {
    this.pushToTalk = value;
    chrome.storage.local.set({ [AudioConfig.PushToTalk]: value });
    this._waveform.postMessage(clone({ type: EventConfig.AudioPushToTalk, payload: { pushToTalk: value } }), '*');

    if (!this.enabled) return;

    if (this.pushToTalk) {
      this.__setupEvents();
    } else {
      this.__removeEvents();
    }
  }
}

const microphone = Microphone.createInstance();

export { microphone, Microphone };
