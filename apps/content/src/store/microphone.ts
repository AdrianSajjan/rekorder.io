import { makeAutoObservable } from 'mobx';
import { clone } from '@rekorder.io/utils';
import { Autocomplete } from '@rekorder.io/types';
import { EventConfig, StorageConfig } from '@rekorder.io/constants';
import { checkPushToTalkActive, checkPushToTalkInactive } from '@rekorder.io/utils';
import { shadowRootElementById } from '../lib/utils';

class Microphone {
  muted: boolean;
  enabled: boolean;
  pushToTalk: boolean;
  device: Autocomplete<'n/a'>;

  constructor() {
    this.muted = false;
    this.device = 'n/a';
    this.enabled = true;
    this.pushToTalk = false;

    this.__initialize();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Microphone();
  }

  private get _waveform() {
    const iframe = shadowRootElementById('rekorder-waveform-iframe') as HTMLIFrameElement | null;
    return iframe?.contentWindow ?? window;
  }

  private __initialize() {
    if (import.meta.env.DEV) return;
    chrome.storage.local.get([StorageConfig.AudioMuted, StorageConfig.AudioPushToTalk, StorageConfig.AudioDeviceId], (result) => {
      this.muted = result[StorageConfig.AudioMuted] || false;
      this.pushToTalk = result[StorageConfig.AudioPushToTalk] || false;
      this.device = result[StorageConfig.AudioDeviceId] || 'n/a';
    });
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
    if (!this.muted || !this.enabled) return;

    if (checkPushToTalkActive(event)) {
      this._waveform.postMessage(clone({ type: EventConfig.ChangeAudioPushToTalkActivity, payload: { active: true } }), '*');
      chrome.runtime.sendMessage({ type: EventConfig.ChangeAudioPushToTalkActivity, payload: { active: true } });
      this.muted = false;
    }
  }

  private __handleKeyUp(event: KeyboardEvent) {
    if (this.muted || !this.enabled) return;

    if (checkPushToTalkInactive(event)) {
      this._waveform.postMessage(clone({ type: EventConfig.ChangeAudioPushToTalkActivity, payload: { active: false } }), '*');
      chrome.runtime.sendMessage({ type: EventConfig.ChangeAudioPushToTalkActivity, payload: { active: false } });
      this.muted = true;
    }
  }

  changeDevice(value: Autocomplete<'n/a'>) {
    this.device = value;
    chrome.storage.local.set({ [StorageConfig.AudioDeviceId]: value });
    this._waveform.postMessage(clone({ type: EventConfig.ChangeAudioDevice, payload: { device: value } }), '*');
  }

  updateEnabled(value: boolean | 'toggle') {
    this.enabled = value === 'toggle' ? !this.enabled : value;
    chrome.runtime.sendMessage({ type: EventConfig.ChangeAudioMutedState, payload: { muted: this.enabled } });
  }

  updatePushToTalk(value: boolean) {
    this.pushToTalk = value;
    this.muted = this.pushToTalk;

    chrome.storage.local.set({ [StorageConfig.AudioPushToTalk]: value });
    this._waveform.postMessage(clone({ type: EventConfig.ChangeAudioPushToTalk, payload: { active: value } }), '*');
    chrome.runtime.sendMessage({ type: EventConfig.ChangeAudioPushToTalk, payload: { active: value } });

    if (this.enabled) {
      if (this.pushToTalk) {
        this.__setupEvents();
      } else {
        this.__removeEvents();
      }
    }
  }

  dispose() {
    this.__removeEvents();
  }
}

const microphone = Microphone.createInstance();

export { microphone, Microphone };
