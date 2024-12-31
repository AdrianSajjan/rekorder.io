import { makeAutoObservable } from 'mobx';
import { Autocomplete, CameraEffects } from '@rekorder.io/types';

class Camera {
  flip: boolean;
  enabled: boolean;

  effect: CameraEffects;
  device: Autocomplete<'n/a'>;
  stream: MediaStream | null;

  constructor() {
    this.flip = true;
    this.enabled = true;

    this.stream = null;
    this.device = 'n/a';
    this.effect = 'none';

    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Camera();
  }

  changeDevice(device: Autocomplete<'n/a'>) {
    this.device = device;
  }

  updateEffect(effect: CameraEffects) {
    this.effect = effect;
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
