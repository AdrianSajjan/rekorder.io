export interface AudioFile {
  id: string;
  file: File;
  layer: number;
  duration: number;
  timeline: AudioTimeline;
}

export interface AudioTimeline {
  start: number;
  end: number;
}
