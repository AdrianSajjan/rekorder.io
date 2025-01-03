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

  updateEnabled(enabled: boolean | 'toggle') {
    this.enabled = enabled === 'toggle' ? !this.enabled : enabled;
  }

  updateActionbarState(actionbarState: string) {
    const state = actionbarState || this.actionbarState;
    this.actionbarState = actionbarState;

    switch (state) {
      case 'draw':
        editor.toggleDrawingMode();
        break;
      case 'blur':
        blur.toggle();
        break;
    }
  }

  updateVisibilityState(state: Record<string, boolean>) {
    this.visibilityState = Object.assign({}, this.visibilityState, state);
  }
}

const toolbar = Toolbar.createInstance();

export { toolbar, Toolbar };
