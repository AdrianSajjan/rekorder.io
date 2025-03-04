import * as MP4Muxer from 'mp4-muxer';
import * as WebMMuxer from 'webm-muxer';
import { wait } from '@rekorder.io/utils';
import { MP4Player } from '../player';

interface Position {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

interface Dimension {
  width: number;
  height: number;
}

interface VideoCropperOptions {
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
}

export class VideoCropper {
  private player: MP4Player;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private position: Position;
  private dimension: Dimension;

  private signal?: AbortSignal;
  private onProgress?: (progress: number) => void;

  constructor(video: string, options?: VideoCropperOptions) {
    this.position = { top: 0, left: 0, right: 0, bottom: 0 };
    this.dimension = { width: 0, height: 0 };

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
    this.player = MP4Player.createInstance(video);

    this.signal = options?.signal;
    this.onProgress = options?.onProgress;
  }

  static createInstance(video: string, options?: VideoCropperOptions) {
    return new VideoCropper(video, options);
  }

  private async handleInitializePlayer() {
    switch (this.player.status) {
      case 'error':
        throw new Error('Player is in error state');
      default:
        await this.player.initialize();
    }
  }

  async initialize(position: Position) {
    await this.handleInitializePlayer();

    this.position = position;
    this.dimension.width = Math.round(this.position.right - this.position.left);
    this.dimension.height = Math.round(this.position.bottom - this.position.top);

    if (this.dimension.width % 2 !== 0) this.dimension.width -= 1;
    if (this.dimension.height % 2 !== 0) this.dimension.height -= 1;

    this.canvas.width = this.dimension.width;
    this.canvas.height = this.dimension.height;
  }

  async process() {
    this.onProgress?.(0);
    await this.handleInitializePlayer();

    const top = this.position.top;
    const left = this.position.left;
    const width = this.dimension.width % 2 === 0 ? this.dimension.width : this.dimension.width - 1;
    const height = this.dimension.height % 2 === 0 ? this.dimension.height : this.dimension.height - 1;
    const fps = this.player.videoMetadata?.fps || 30;

    const mp4Muxer = new MP4Muxer.Muxer({
      target: new MP4Muxer.ArrayBufferTarget(),
      fastStart: 'in-memory',
      firstTimestampBehavior: 'offset',
      video: {
        codec: 'avc',
        width,
        height,
        frameRate: fps,
      },
    });

    const webmMuxer = new WebMMuxer.Muxer({
      target: new WebMMuxer.ArrayBufferTarget(),
      firstTimestampBehavior: 'offset',
      type: 'webm',
      video: {
        codec: 'V_VP9',
        width,
        height,
        frameRate: fps,
      },
    });

    const mp4VideoEncoder = new VideoEncoder({
      output: (chunk, meta) => {
        mp4Muxer.addVideoChunk(chunk, meta);
      },
      error: (error) => {
        console.warn('Failed to write chunk:', error);
      },
    });

    const webmVideoEncoder = new VideoEncoder({
      output: (chunk, meta) => {
        webmMuxer.addVideoChunk(chunk, meta);
      },
      error: (error) => {
        console.warn('Failed to write chunk:', error);
      },
    });

    const mp4Config: VideoEncoderConfig = { width, height, framerate: fps, codec: 'avc1.64002A' };
    const mp4Support = await VideoEncoder.isConfigSupported(mp4Config);
    console.assert(mp4Support.supported, 'MP4 video config not supported:', mp4Config);
    mp4VideoEncoder.configure(mp4Config);

    const webmConfig: VideoEncoderConfig = { width, height, framerate: fps, codec: 'vp09.00.10.08' };
    const webmSupport = await VideoEncoder.isConfigSupported(webmConfig);
    console.assert(webmSupport.supported, 'WEBM video config not supported:', webmConfig);
    webmVideoEncoder.configure(webmConfig);

    while (true) {
      if (this.player.currentFrame >= this.player.videoMetadata!.frames) break;

      this.signal?.throwIfAborted();
      this.onProgress?.((this.player.currentFrame / this.player.videoMetadata!.frames) * 100);

      const bitmap = await this.player.next();
      this.context.drawImage(bitmap, left, top, width, height, 0, 0, width, height);
      bitmap.close();

      const keyframe = this.player.currentFrame % (fps * 2) === 0;
      const timestamp = (this.player.currentFrame * 1e6) / fps;
      const frame = new VideoFrame(this.canvas, { timestamp, duration: 1e6 / fps, alpha: 'discard' });
      const clone = frame.clone();

      while (true) {
        if (mp4VideoEncoder.encodeQueueSize <= 10 && webmVideoEncoder.encodeQueueSize <= 10) break;
        this.signal?.throwIfAborted();
        console.log('Encoder queue is full, waiting...');
        await wait(100);
      }

      mp4VideoEncoder.encode(frame, { keyFrame: keyframe });
      webmVideoEncoder.encode(clone, { keyFrame: keyframe });

      frame.close();
      clone.close();
    }

    await mp4VideoEncoder.flush();
    await webmVideoEncoder.flush();
    this.signal?.throwIfAborted();

    mp4VideoEncoder.close();
    webmVideoEncoder.close();
    mp4Muxer.finalize();
    webmMuxer.finalize();

    return {
      mp4: new Blob([mp4Muxer.target.buffer], { type: 'video/mp4' }),
      webm: new Blob([webmMuxer.target.buffer], { type: 'video/webm' }),
    };
  }

  destroy() {
    this.player.destroy();
  }
}
