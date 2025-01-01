import { theme } from '@rekorder.io/constants';

class AudioWaveform {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;

  private audioContext: AudioContext | null;
  private analyserNode: AnalyserNode | null;
  private animationFrame: number | null;

  private draw: boolean;
  private pushToTalk: boolean;

  private stream: MediaStream | null;
  private dataArray: Uint8Array | null;
  private bufferLength: number | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.pushToTalk = false;
    this.draw = false;

    this.dataArray = null;
    this.bufferLength = null;
    this.stream = null;

    this.audioContext = null;
    this.analyserNode = null;
    this.animationFrame = null;
  }

  static createInstance(canvas: HTMLCanvasElement): AudioWaveform {
    return new AudioWaveform(canvas);
  }

  private __drawWaveform(): void {
    if (!this.analyserNode || !this.context || !this.dataArray || !this.bufferLength) return;

    this.animationFrame = requestAnimationFrame(this.__drawWaveform.bind(this));
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.lineWidth = 4;
    this.context.strokeStyle = theme.colors.primary.main;

    if (!this.draw) {
      this.context.beginPath();
      this.context.moveTo(0, this.canvas.height / 2);
      this.context.lineTo(this.canvas.width, this.canvas.height / 2);
      this.context.stroke();
    } else {
      this.analyserNode.getByteTimeDomainData(this.dataArray);
      this.context.beginPath();

      let x = 0;
      const sliceWidth = this.canvas.width / this.bufferLength;

      for (let i = 0; i < this.bufferLength; i++) {
        const v = this.dataArray[i] / 128.0;
        const y = (v * this.canvas.height) / 2;
        if (i === 0) {
          this.context.moveTo(x, y);
        } else {
          this.context.lineTo(x, y);
        }
        x += sliceWidth;
      }

      this.context.lineTo(this.canvas.width, this.canvas.height / 2);
      this.context.stroke();
    }
  }

  private __startDrawing(): void {
    if (!this.analyserNode || !this.context) return;

    this.bufferLength = this.analyserNode.fftSize;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.__drawWaveform();
  }

  async start(constraints?: MediaStreamConstraints): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia(constraints || { audio: true });
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(this.stream);

    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;
    source.connect(this.analyserNode);
    this.__startDrawing();
  }

  enableAudioTracks() {
    this.draw = true;
    this.stream?.getAudioTracks().forEach((track) => (track.enabled = true));
  }

  disableAudioTracks() {
    this.draw = false;
    this.stream?.getAudioTracks().forEach((track) => (track.enabled = false));
  }

  update(value: boolean) {
    this.pushToTalk = value;
    if (this.pushToTalk) {
      this.disableAudioTracks();
    } else {
      this.enableAudioTracks();
    }
  }

  stop(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.audioContext) this.audioContext.close();
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());

    this.animationFrame = null;
    this.audioContext = null;
    this.bufferLength = null;
    this.dataArray = null;
  }
}

export { AudioWaveform };
