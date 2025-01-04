import { Canvas } from 'fabric';
import { CanvasHistory } from '../plugins/history';

export function findCanvasObjectById(canvas: Canvas, id: string) {
  return canvas._objects.find((object) => object.id === id);
}

export function findCanvasHistoryById(id: string, history?: CanvasHistory) {
  return history?.state.find((object) => object.id === id);
}
