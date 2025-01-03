import { makeAutoObservable } from 'mobx';
import { Autocomplete, CameraEffects } from '@rekorder.io/types';
import { clone } from '@rekorder.io/utils';
import { StorageConfig, EventConfig } from '@rekorder.io/constants';
class Camera {
  flip: boolean;
  enabled: boolean;
  effect: CameraEffects;
  device: Autocomplete<'n/a'>;

  constructor() {
    this.flip = true;
    this.enabled = true;
    this.device = 'n/a';
    this.effect = 'none';
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Camera();
  }

  changeDevice(device: Autocomplete<'n/a'>) {
    this.device = device;
    chrome.storage.local.set({ [StorageConfig.CameraDeviceId]: this.device });
    window.postMessage(clone({ type: EventConfig.ChangeCameraDevice, payload: { device } }), '*');
  }

  updateEffect(effect: CameraEffects) {
    this.effect = effect;
    chrome.storage.local.set({ [StorageConfig.CameraEffect]: this.effect });
    window.postMessage(clone({ type: EventConfig.ChangeCameraEffect, payload: { effect } }), '*');
  }

  updateFlip(value: boolean | 'toggle') {
    this.flip = value === 'toggle' ? !this.flip : value;
  }

  updateEnabled(value: boolean | 'toggle') {
    this.enabled = value === 'toggle' ? !this.enabled : value;
  }
}

const camera = Camera.createInstance();

export { camera, Camera, type CameraEffects };
