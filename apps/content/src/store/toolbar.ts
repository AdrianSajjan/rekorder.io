import { makeAutoObservable } from 'mobx';

import { editor } from './editor';
import { blur } from './blur';

class Toolbar {
  enabled: boolean;
  actionbarState: string;
  visibilityState: Record<string, boolean>;

  constructor() {
    this.enabled = false;
    this.actionbarState = '';
    this.visibilityState = {};

    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Toolbar();
  }

  private __updateActionbarState(state: string) {
    switch (state) {
      case 'draw':
        editor.toggleDrawingMode();
        break;
      case 'blur':
        blur.toggle();
        break;
    }
  }

  updateEnabled(enabled: boolean | 'toggle') {
    this.enabled = enabled === 'toggle' ? !this.enabled : enabled;
  }

  updateActionbarState(actionbarState: string) {
    const previousState = this.actionbarState;
    this.actionbarState = actionbarState;
    this.__updateActionbarState(previousState);
    this.__updateActionbarState(actionbarState);
  }

  updateVisibilityState(state: Record<string, boolean>) {
    this.visibilityState = Object.assign({}, this.visibilityState, state);
  }
}

const toolbar = Toolbar.createInstance();

export { toolbar, Toolbar };
