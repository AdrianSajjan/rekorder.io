import { makeAutoObservable } from 'mobx';

type CursorMode = 'default-cursor' | 'highlight-click' | 'highlight-cursor' | 'spotlight-cursor';

class Cursor {
  mode: CursorMode;
  clientX: number;
  clientY: number;

  constructor() {
    this.clientX = 0;
    this.clientY = 0;
    this.mode = 'default-cursor';

    this.__setupEvents();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Cursor();
  }

  private __handleMouseMove(event: MouseEvent) {
    this.clientX = event.clientX;
    this.clientY = event.clientY;
  }

  private __setupEvents() {
    document.addEventListener('mousemove', (event) => this.__handleMouseMove(event));
  }

  update(mode: CursorMode) {
    if (mode) this.mode = mode;
  }
}

const cursor = Cursor.createInstance();

export { cursor, Cursor, type CursorMode };
