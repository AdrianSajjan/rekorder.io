import { makeAutoObservable } from "mobx";

class Toolbar {
  enabled: boolean;
  actionbarState: string | false;
  visibilityState: Record<string, boolean>;

  constructor() {
    this.enabled = false;
    this.visibilityState = {};
    this.actionbarState = false;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Toolbar();
  }

  updateEnabled(enabled: boolean | "toggle") {
    this.enabled = enabled === "toggle" ? !this.enabled : enabled;
  }

  updateActionbarState(actionbarState: string, toggle?: boolean) {
    this.actionbarState = !toggle || this.actionbarState !== actionbarState ? actionbarState : false;
  }

  updateVisibilityState(state: Record<string, boolean>) {
    this.visibilityState = Object.assign({}, this.visibilityState, state);
  }
}

const toolbar = Toolbar.createInstance();

export { toolbar, Toolbar };
