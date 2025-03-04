import clsx from 'clsx';
import css from 'styled-jsx/css';

import { throttle } from 'lodash';
import { forwardRef, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CornersOut, Pause, PictureInPicture, Play, PushPin, PushPinSlash, SpeakerHigh, SpeakerX } from '@phosphor-icons/react';
import { HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger } from '@radix-ui/react-hover-card';
import { Slider, SliderRange, SliderThumb, SliderTrack, type SliderProps } from '@radix-ui/react-slider';
import { formatSecondsToMMSS } from '@rekorder.io/utils';

import { theme } from '../../theme';
import { animations } from '../../animations';
import { ResolvedStyle } from '../style/resolved-style';

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  container?: string;
}

const VideoPlayerCSS = css.resolve`
  * {
    box-sizing: border-box;
  }

  button {
    all: unset;
  }

  .rekorder-video-player-container {
    position: relative;
    overflow: hidden;

    height: fit-content;
    width: fit-content;
    font-family: ${theme.fonts.default};
  }

  .rekorder-video-player {
    display: block;
    transition: 0.2s ease-out;
  }

  .rekorder-video-player-start {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);

    display: grid;
    cursor: pointer;
    place-items: center;
    backdrop-filter: blur(6px);

    width: ${theme.space(15)};
    height: ${theme.space(15)};
    border-radius: ${theme.space(10)};

    border: 1px solid ${theme.alpha(theme.colors.card.text, 0.2)};
    background-color: ${theme.alpha(theme.colors.card.text, 0.5)};
  }

  .rekorder-video-player-controls {
    display: flex;
    position: absolute;
    align-items: center;

    overflow-x: auto;
    overflow-y: hidden;
    backdrop-filter: blur(6px);

    gap: ${theme.space(1.5)};
    transform: translateY(calc(100% + ${theme.space(3)}));
    transition: transform 0.2s ease-in-out;

    left: ${theme.space(3)};
    right: ${theme.space(3)};
    bottom: ${theme.space(3)};

    height: ${theme.space(10)};
    padding: 0px ${theme.space(2)} 0px ${theme.space(1)};
    border-radius: ${theme.space(2)};
    background-color: ${theme.alpha(theme.colors.card.text, 0.5)};
  }

  .rekorder-video-player-controls::-webkit-scrollbar {
    display: none;
  }

  .rekorder-video-player-controls[data-pinned='true'] {
    transform: translateY(0px);
  }

  .rekorder-video-player-container:hover .rekorder-video-player-controls {
    transform: translateY(0px);
  }

  .rekorder-video-player-control {
    width: ${theme.space(8)};
    height: ${theme.space(8)};
    color: ${theme.colors.card.background};

    display: grid;
    place-items: center;
    cursor: pointer;

    flex-shrink: 0;
    border-radius: ${theme.space(8)};
    transition: transform 100ms linear;
  }

  .rekorder-video-player-control[data-position='right'] {
    margin-left: auto;
  }

  .rekorder-video-player-control:focus-visible {
    transform: scale(1.1);
  }

  .rekorder-video-player-slider {
    position: relative;
    display: flex;
    align-items: center;

    user-select: none;
    touch-action: none;
    width: 100%;

    height: ${theme.space(4)};
    min-width: ${theme.space(56)};
    max-width: ${theme.screens.xxs}px;
  }

  .rekorder-video-player-slider[data-orientation='vertical'] {
    flex-direction: column;
    max-width: unset;

    height: ${theme.space(30)};
    width: ${theme.space(6)};
  }

  .rekorder-video-player-slider-track {
    position: relative;
    flex-grow: 1;
    overflow: hidden;

    height: ${theme.space(4)};
    border-radius: ${theme.space(1)};
    background-color: ${theme.alpha(theme.colors.card.background, 0.2)};
  }

  .rekorder-video-player-slider-track[data-orientation='vertical'] {
    height: unset;
    width: ${theme.space(6)};
  }

  .rekorder-video-player-slider-range {
    height: 100%;
    position: absolute;
    background-color: ${theme.colors.card.background};
  }

  .rekorder-video-player-slider-range[data-orientation='vertical'] {
    width: 100%;
    height: unset;
  }

  .rekorder-video-player-slider-thumb {
    display: none;

    width: ${theme.space(2)};
    height: ${theme.space(4)};
    border-radius: ${theme.space(1)};

    box-shadow: ${theme.shadow().sm};
    border: 1px solid ${theme.colors.borders.input};
    background-color: ${theme.colors.card.background};
  }

  .rekorder-video-player-slider-thumb[data-orientation='vertical'] {
    width: ${theme.space(7)};
    height: ${theme.space(2)};
  }

  .rekorder-video-player-slider-thumb:focus-visible {
    outline: none;
    box-shadow: ${theme.ring()};
  }

  .rekorder-video-player-time {
    font-size: 11px;
    font-weight: 400;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;

    margin-left: ${theme.space(1.5)};
    margin-right: ${theme.space(4)};
    color: ${theme.colors.card.background};
    opacity: 0.8;
  }

  .rekorder-video-player-audio-control {
    padding-bottom: ${theme.space(1)};
  }

  .rekorder-video-player-audio-control-container {
    padding: ${theme.space(2)};
    border-top-left-radius: ${theme.space(2)};
    border-top-right-radius: ${theme.space(2)};

    backdrop-filter: blur(6px);
    background-color: ${theme.alpha(theme.colors.card.text, 0.5)};
  }

  .rekorder-video-player-audio-control[data-state='open'] {
    animation-duration: 150ms;
    animation-timing-function: ease-out;
    animation-name: ${animations['slide-up-fade-in']};
  }

  .rekorder-video-player-audio-control[data-state='closed'] {
    animation-duration: 100ms;
    animation-timing-function: ease-out;
    animation-name: ${animations['slide-down-fade-out']};
  }
`;

interface VideoPlayerControls {
  started: boolean;
  playing: boolean;
  muted: boolean;
  pinned: boolean;
  loaded: boolean;
  seek: number;
  duration: number;
  volume: number;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ container, children, className, controls: isControlsVisible = true, ...props }, ref) => {
  const video$ = useRef<HTMLVideoElement>(null!);
  const container$ = useRef<HTMLDivElement>(null!);

  const [controls, setControls] = useState<VideoPlayerControls>({
    started: false,
    playing: false,
    muted: false,
    pinned: false,
    loaded: false,
    seek: 0,
    duration: 0,
    volume: 1,
  });

  useEffect(() => {
    const controller = new AbortController();

    video$.current.addEventListener(
      'loadedmetadata',
      () => {
        setControls((state) => ({
          ...state,
          loaded: true,
          muted: video$.current.muted,
          volume: video$.current.volume,
          seek: video$.current.currentTime,
          duration: video$.current.duration,
        }));
      },
      { signal: controller.signal }
    );

    video$.current.addEventListener(
      'play',
      () => {
        setControls((state) => ({ ...state, playing: true }));
      },
      { signal: controller.signal }
    );

    video$.current.addEventListener(
      'durationchange',
      () => {
        setControls((state) => ({ ...state, duration: video$.current.duration }));
      },
      { signal: controller.signal }
    );

    video$.current.addEventListener(
      'timeupdate',
      () => {
        setControls((state) => ({ ...state, seek: video$.current.currentTime }));
      },
      { signal: controller.signal }
    );

    video$.current.addEventListener(
      'ended',
      () => {
        setControls((state) => ({ ...state, playing: false }));
      },
      { signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  }, []);

  const handleResize = useMemo(() => {
    return throttle(
      () => {
        const video = video$.current.getBoundingClientRect();
        const container = container$.current.parentElement!.getBoundingClientRect();
        const ratio = video$.current.videoWidth / video$.current.videoHeight;

        let width: string | undefined;
        let height: string | undefined;

        if (video.width > container.width || video.height > container.height) {
          if (video.width > container.width) {
            width = container.width + 'px';
            height = container.width / ratio + 'px';
          }
          if (video.height > container.height) {
            height = container.height + 'px';
            width = container.height * ratio + 'px';
          }
        } else {
          if (video$.current.videoWidth > video$.current.videoHeight) {
            width = container.width + 'px';
            height = container.width / ratio + 'px';
          } else {
            height = container.height + 'px';
            width = container.height * ratio + 'px';
          }
        }

        if (width) video$.current.style.width = width;
        if (height) video$.current.style.height = height;
      },
      200,
      {
        leading: true,
      }
    );
  }, []);

  useEffect(() => {
    if (!container$.current || !container$.current.parentElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container$.current.parentElement) {
          handleResize();
          break;
        }
      }
    });

    handleResize();
    resizeObserver.observe(container$.current.parentElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize]);

  const handleInitializeRefs = useCallback(
    (node: HTMLVideoElement) => {
      video$.current = node;
      if (ref) {
        if (typeof ref === 'function') ref(node);
        else ref.current = node;
      }
    },
    [ref]
  );

  const handlePlay = useCallback(() => {
    setControls((state) => ({ ...state, playing: true, started: true }));
    video$.current.play();
  }, []);

  const handlePause = useCallback(() => {
    setControls((state) => ({ ...state, playing: false }));
    video$.current.pause();
  }, []);

  const handleSeek = useCallback(([value]: number[]) => {
    setControls((state) => ({ ...state, seek: value }));
    video$.current.currentTime = value;
  }, []);

  const handleChangeVolume = useCallback(([value]: number[]) => {
    setControls((state) => ({ ...state, volume: value }));
    video$.current.volume = value;
  }, []);

  const handleTogglePlayback = useCallback(() => {
    if (controls.playing) handlePause();
    else handlePlay();
  }, [controls.playing, handlePlay, handlePause]);

  const handleTogglePIP = useCallback(() => {
    if (document.pictureInPictureElement) document.exitPictureInPicture();
    else video$.current.requestPictureInPicture();
  }, []);

  const handleToggleMuted = useCallback(() => {
    setControls((state) => ({ ...state, muted: !state.muted }));
    video$.current.muted = !video$.current.muted;
  }, []);

  const handleTogglePinned = useCallback(() => {
    setControls((state) => ({ ...state, pinned: !state.pinned }));
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else video$.current.requestFullscreen();
  }, []);

  return (
    <Fragment>
      <ResolvedStyle>{VideoPlayerCSS}</ResolvedStyle>
      <div id="rekorder-video-player" ref={container$} className={clsx(container, 'rekorder-video-player-container', VideoPlayerCSS.className)}>
        <video ref={handleInitializeRefs} {...props} className={clsx(className, 'rekorder-video-player', VideoPlayerCSS.className)} controls={false} />
        {!isControlsVisible || !controls.loaded ? null : controls.started || controls.playing ? (
          <div className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-controls')} data-pinned={controls.pinned}>
            <button className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-control')} onClick={handleTogglePlayback}>
              {controls.playing ? <Pause weight="fill" size={18} /> : <Play weight="fill" size={18} />}
            </button>

            <VideoTimelineSeeker min={0} max={controls.duration} value={[controls.seek]} onValueChange={handleSeek} />
            <div className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-time')}>
              {formatSecondsToMMSS(controls.seek)} / {formatSecondsToMMSS(controls.duration)}
            </div>

            <HoverCard openDelay={0} closeDelay={0} {...props}>
              <HoverCardTrigger asChild>
                <button data-position="right" className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-control')} onClick={handleToggleMuted}>
                  {controls.muted ? <SpeakerX size={18} weight="fill" /> : <SpeakerHigh size={18} weight="fill" />}
                </button>
              </HoverCardTrigger>
              <HoverCardPortal container={container$.current}>
                <HoverCardContent side="top" className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-audio-control')}>
                  <VideoSoundControl min={0} max={1} step={0.01} value={[controls.volume]} onValueChange={handleChangeVolume} />
                </HoverCardContent>
              </HoverCardPortal>
            </HoverCard>

            <button className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-control')} onClick={handleTogglePIP}>
              <PictureInPicture size={18} weight="fill" />
            </button>
            <button className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-control')} onClick={handleToggleFullscreen}>
              <CornersOut size={18} weight="fill" />
            </button>
            <button className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-control')} onClick={handleTogglePinned}>
              {!controls.pinned ? <PushPinSlash size={18} weight="fill" /> : <PushPin size={18} weight="fill" />}
            </button>
          </div>
        ) : (
          <button className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-start')} onClick={handlePlay}>
            <Play weight="fill" size={24} color={theme.colors.card.background} />
          </button>
        )}
        {children}
      </div>
    </Fragment>
  );
});

function VideoTimelineSeeker(props: SliderProps) {
  return (
    <Slider step={0.01} {...props} className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-slider')}>
      <SliderTrack className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-slider-track')}>
        <SliderRange className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-slider-range')} />
      </SliderTrack>
      <SliderThumb className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-slider-thumb')} />
    </Slider>
  );
}

function VideoSoundControl({ children, ...props }: SliderProps) {
  return (
    <div className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-audio-control-container')}>
      <Slider step={1} orientation="vertical" {...props} className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-slider')}>
        <SliderTrack className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-slider-track')}>
          <SliderRange className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-slider-range')} />
        </SliderTrack>
        <SliderThumb className={clsx(VideoPlayerCSS.className, 'rekorder-video-player-slider-thumb')} />
      </Slider>
    </div>
  );
}

VideoPlayer.displayName = 'VideoPlayer';

export { VideoPlayer };
