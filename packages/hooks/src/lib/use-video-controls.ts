import { useCallback, useEffect, useState } from 'react';

const isVideoPlaying = (video: HTMLVideoElement) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);

export function useVideoControls(element: HTMLVideoElement) {
  const [controls, setControls] = useState(() => ({ playing: isVideoPlaying(element), muted: element.muted, duration: element.duration, seek: element.currentTime, volume: element.volume }));

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    element.addEventListener(
      'loadedmetadata',
      () => {
        setControls((state) => ({ ...state, duration: element.duration }));
      },
      { signal }
    );

    element.addEventListener(
      'play',
      () => {
        setControls((state) => ({ ...state, playing: true }));
      },
      { signal }
    );

    element.addEventListener(
      'durationchange',
      () => {
        setControls((state) => ({ ...state, duration: element.duration }));
      },
      { signal: controller.signal }
    );

    element.addEventListener(
      'timeupdate',
      () => {
        setControls((state) => ({ ...state, seek: element.currentTime }));
      },
      { signal: controller.signal }
    );

    element.addEventListener(
      'ended',
      () => {
        setControls((state) => ({ ...state, playing: false }));
      },
      { signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  }, [element]);

  const handlePlay = useCallback(() => {
    element.play();
    setControls((state) => ({ ...state, playing: true }));
  }, [element]);

  const handlePause = useCallback(() => {
    element.pause();
    setControls((state) => ({ ...state, playing: false }));
  }, [element]);

  const handleTogglePlayback = useCallback(() => {
    element.paused ? element.play() : element.pause();
    setControls((state) => ({ ...state, playing: !state.playing }));
  }, [element]);

  const handleSeek = useCallback(
    (value: number) => {
      element.currentTime = value;
      setControls((state) => ({ ...state, seek: value }));
    },
    [element]
  );

  return {
    controls,
    handleSeek,
    handlePlay,
    handlePause,
    handleTogglePlayback,
  };
}
