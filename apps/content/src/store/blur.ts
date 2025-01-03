import { theme } from '@rekorder.io/ui';
import { makeAutoObservable } from 'mobx';
import { RECORDER_ROOT } from '../constants/layout';

type Styles = Record<string, any>;

class ElementBlur {
  enabled: boolean;
  private _styles: Map<HTMLElement, Styles>;

  constructor() {
    this.enabled = false;
    this._styles = new Map();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new ElementBlur();
  }

  private __isRecorderRoot(event: MouseEvent) {
    const element = event.target as HTMLElement;
    const root = document.getElementById(RECORDER_ROOT) as HTMLElement;
    return root.contains(element);
  }

  private __handleMouseOver(event: MouseEvent) {
    if (!this.enabled || this.__isRecorderRoot(event)) return;

    const element = event.target as HTMLElement;
    const style = this._styles.get(element);

    if (!style?.outline) this._styles.set(element, { outline: element.style.outline });
    element.style.outline = `1.5px solid ${theme.colors.primary.main}`;
  }

  private __handleMouseOut(event: MouseEvent) {
    if (!this.enabled || this.__isRecorderRoot(event)) return;

    const element = event.target as HTMLElement;
    const style = this._styles.get(element);

    if (element.style.outline !== style?.outline) element.style.outline = style?.outline ?? 'none';
    if (!style?.blured) this._styles.delete(element);
  }

  private __handleMouseDown(event: MouseEvent) {
    if (!this.enabled || this.__isRecorderRoot(event)) return;

    const element = event.target as HTMLElement;
    const style = this._styles.get(element);

    if (!style?.blured) {
      this._styles.set(element, { ...style, filter: element.style.filter, blured: true });
      element.style.filter = 'blur(10px)';
    } else {
      element.style.filter = style.filter ?? 'none';
      this._styles.delete(element);
    }
  }

  private __flushStyles() {
    this._styles.forEach((style, element) => {
      element.style.outline = style.outline;
    });
    this._styles.clear();
  }

  private __setupEvents() {
    document.addEventListener('mouseover', this.__handleMouseOver);
    document.addEventListener('mouseout', this.__handleMouseOut);
    document.addEventListener('mousedown', this.__handleMouseDown);
  }

  private __resetEvents() {
    document.removeEventListener('mouseover', this.__handleMouseOver);
    document.removeEventListener('mouseout', this.__handleMouseOut);
    document.removeEventListener('mousedown', this.__handleMouseDown);
  }

  toggle() {
    if (this.enabled) this.dispose();
    else this.initialize();
  }

  initialize() {
    this.enabled = true;
    this.__setupEvents();
  }

  dispose() {
    this.enabled = false;
    this.__resetEvents();
    this.__flushStyles();
  }
}

const blur = ElementBlur.createInstance();

export { blur, ElementBlur };
