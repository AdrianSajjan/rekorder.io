import { AudioWaveform } from "@screenify.io/recorder/lib/waveform";
import { useCallback, useEffect, useState } from "react";

export function useAudioWaveform(audio: string, pushToTalk: boolean) {
  const [waveform, setWaveform] = useState<AudioWaveform>();

  const createWaveform = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) setWaveform(AudioWaveform.createInstance(canvas));
  }, []);

  useEffect(() => {
    if (!waveform || audio === "n/a") return;
    waveform.start({ audio: { deviceId: audio } });
    return () => waveform.stop();
  }, [waveform, audio]);

  useEffect(() => {
    if (!waveform) return;
    waveform.update(pushToTalk);
  }, [waveform, pushToTalk]);

  return createWaveform;
}
