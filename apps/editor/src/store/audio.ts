import { nanoid } from 'nanoid';
import { makeAutoObservable } from 'mobx';
import { MP4Player } from '@rekorder.io/player';
import { Editor } from './editor';

interface AudioFile {
  id: string;
  file: File;
  end: number;
  start: number;
  duration: number;
}

export class Audio {
  private _editor: Editor;
  private _url: string | null;
  private _player: MP4Player | null;

  files: AudioFile[];

  constructor(editor: Editor) {
    this._url = null;
    this._player = null;
    this._editor = editor;

    this.files = [];
    makeAutoObservable(this);
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
      const audio = new window.Audio();

      audio.addEventListener(
        'loadedmetadata',
        () => {
          const id = nanoid();
          const duration = audio.duration;
          this.files.push({ id, file, duration: duration, start: 0, end: duration });
          URL.revokeObjectURL(url);
          resolve();
        },
        { once: true }
      );

      audio.addEventListener(
        'error',
        () => {
          URL.revokeObjectURL(url);
          reject('Failed to load audio file');
        },
        { once: true }
      );

      audio.src = url;
    });
  }

  async removeAudioFile(id: string) {
    this.files = this.files.filter((file) => file.id !== id);
  }
}
