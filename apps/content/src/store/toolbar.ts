import { makeAutoObservable } from 'mobx';
import { editor } from './editor';

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
    this.actionbarState = this.actionbarState === actionbarState ? '' : actionbarState;
    if (this.actionbarState === 'draw') editor.toggleDrawingMode();
  }

  updateVisibilityState(state: Record<string, boolean>) {
    this.visibilityState = Object.assign({}, this.visibilityState, state);
  }
}

const toolbar = Toolbar.createInstance();

export { toolbar, Toolbar };
