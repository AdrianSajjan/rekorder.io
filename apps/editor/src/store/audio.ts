import { nanoid } from 'nanoid';
import { makeAutoObservable, runInAction } from 'mobx';
import { MP4Player } from '@rekorder.io/player';

import { Editor } from './editor';
import { AudioFile, AudioTimeline } from '../types/audio';

export class Audio {
  private _editor: Editor;
  private _url: string | null;
  private _player: MP4Player | null;

  files: AudioFile[];
  selected: string | null;

  constructor(editor: Editor) {
    this._url = null;
    this._player = null;
    this._editor = editor;

    this.files = [];
    this.selected = null;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance(editor: Editor) {
    return new Audio(editor);
  }

  async initialize() {
    this._url = URL.createObjectURL(this._editor.mp4RecordingOrThrow);
    this._player = MP4Player.createInstance(this._url);
    await this._player.initialize();
  }

  async createAudioFile(file: File) {
    return new Promise<void>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const audio = document.createElement('audio');

      audio.addEventListener(
        'loadedmetadata',
        () => {
          runInAction(() => {
            this.files.push({
              id: nanoid(),
              file,
              duration: audio.duration,
              layer: Math.max(this.files.length + 1, 1),
              timeline: {
                start: 0,
                end: audio.duration,
              },
            });
          });
          URL.revokeObjectURL(url);
          resolve();
        },
        { once: true }
      );

      audio.addEventListener(
        'error',
        () => {
          URL.revokeObjectURL(url);
          reject();
        },
        { once: true }
      );

      audio.src = url;
    });
  }

  removeAudioFile(id: string) {
    this.files = this.files.filter((file) => file.id !== id);
  }

  updateAudioFileLayer(id: string, layer: number) {
    const file = this.files.find((file) => file.id === id);
    if (file) file.layer = layer;
  }

  updateAudioFileTimeline(id: string, timeline: Partial<AudioTimeline>) {
    const file = this.files.find((file) => file.id === id);
    if (file) file.timeline = Object.assign(file.timeline, timeline);
  }

  selectAudioFileToggle(id: string) {
    this.selected = this.selected === id ? null : id;
  }
}
