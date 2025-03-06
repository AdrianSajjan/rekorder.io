import { observer } from 'mobx-react';
import { FastForward, MagnifyingGlassMinus, MagnifyingGlassPlus, MusicNotes, Pause, Play, Plus, Scissors, Trash } from '@phosphor-icons/react';

import { Button, Tooltip } from '@rekorder.io/ui';
import { useMeasure, useVideoControls, VideoControls } from '@rekorder.io/hooks';
import { cn, formatSecondsToMMSS } from '@rekorder.io/utils';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { HEADER_HEIGHT } from '../../../constants/layout';
import { editor } from '../../../store/editor';
import { AudioFile } from '../../../types/audio';

interface IAudioTimelineContext {
  gap: number;
  controls: VideoControls;
  width: number;
}

const MinimumAudioDurationSeconds = 0.5;

const AudioTimelineContext = createContext<IAudioTimelineContext>(null!);

const AudioFooter = observer(() => {
  const { controls, handleTogglePlayback, handleSeek } = useVideoControls(editor.elementOrThrow);

  const [container$, bounds] = useMeasure<HTMLDivElement>();

  const handleAddAudio = useCallback(() => {
    const input = document.getElementById('sidebar-audio-explorer');
    if (input) input.click();
  }, []);

  const layers = Object.entries(
    editor.audio.files.reduce((group, element) => {
      if (!group[element.layer]) group[element.layer] = [];
      group[element.layer].push(element);
      return group;
    }, {} as Record<number, AudioFile[]>)
  );

  const duration = Math.ceil(controls.duration);
  const gap = bounds.width / duration;

  return (
    <Tooltip.Provider>
      <div className="flex items-center shrink-0 justify-between px-4 border-b border-borders-input" style={{ height: HEADER_HEIGHT }}>
        <div className="flex items-center gap-2.5">
          <Tooltip content="Trim Audio">
            <Button size="icon" variant="light" color="accent">
              <Scissors weight="fill" size={16} />
            </Button>
          </Tooltip>
          <Tooltip content="Delete Audio">
            <Button size="icon" variant="light" color="accent">
              <Trash weight="bold" size={16} />
            </Button>
          </Tooltip>
        </div>
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" color="accent" onClick={() => handleSeek(0)}>
            <FastForward weight="fill" size={16} className="rotate-180" />
          </Button>
          <p className="text-sm tabular-nums text-card-text">{formatSecondsToMMSS(controls.seek)}</p>
          <Button size="icon" variant="ghost" color="accent" onClick={handleTogglePlayback}>
            {controls.playing ? <Pause weight="fill" size={16} /> : <Play weight="fill" size={16} />}
          </Button>
          <p className="text-sm tabular-nums text-card-text font-medium">{formatSecondsToMMSS(controls.duration)}</p>
          <Button size="icon" variant="ghost" color="accent" onClick={() => handleSeek(controls.duration)}>
            <FastForward weight="fill" size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2.5">
          <Tooltip content="Timeline Zoom Out">
            <Button size="icon" variant="light" color="accent">
              <MagnifyingGlassMinus weight="bold" size={16} />
            </Button>
          </Tooltip>
          <Tooltip content="Timeline Zoom In">
            <Button size="icon" variant="light" color="accent">
              <MagnifyingGlassPlus weight="bold" size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>
      <AudioTimelineContext.Provider value={{ controls, gap, width: bounds.width }}>
        <div className="flex-1 relative overflow-auto flex flex-col" id="timeline" ref={container$}>
          <div className="w-full h-fit flex px-4 sticky top-0 pb-4 bg-card-background shrink-0 z-10">
            {Array.from({ length: duration + 1 }, (_, key) => (
              <div key={key} className="flex flex-col" style={{ width: key === duration ? 0 : gap }}>
                {key < duration ? (
                  <div className="flex items-start w-full justify-between mb-1">
                    {Array.from({ length: 10 }, (_, index) => (
                      <div
                        key={index}
                        className={cn(
                          'w-px border-l border-text-muted',
                          index === 0 || index === 9 ? 'h-3' : index === 5 ? 'h-2.5' : 'h-2',
                          key > 0 ? (index === 0 ? 'opacity-0' : 'opacity-100') : 'opacity-100'
                        )}
                      />
                    ))}
                  </div>
                ) : null}
                <span className={cn('text-xs w-fit mt-auto shrink-0 tabular-nums text-accent-dark', key > 0 ? (key === duration ? '-translate-x-[85%]' : '-translate-x-1/2') : '-translate-x-1')}>
                  {formatSecondsToMMSS(key)}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full px-4 pb-4 flex flex-col gap-2.5 flex-1">
            {layers.length ? (
              layers.map(([layer, files]) => <AudioTimelineLayer key={layer} layer={Number(layer)} files={files} />)
            ) : (
              <div className="w-full h-64 flex-1 grid place-items-center">
                <Button className="w-full" onClick={handleAddAudio}>
                  <Plus weight="bold" size={16} />
                  <span className="text-sm font-medium">Add Audio</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </AudioTimelineContext.Provider>
    </Tooltip.Provider>
  );
});

const AudioTimelineLayer = observer(({ layer, files }: { layer: number; files: AudioFile[] }) => {
  const { gap, controls } = useContext(AudioTimelineContext);

  switch (layer) {
    default:
      return (
        <div className="h-10 rounded-lg bg-accent-light/50 flex gap-px" style={{ width: gap * controls.duration }}>
          {files.map((file) => (
            <AudioTimelineItem key={file.id} file={file} files={files} />
          ))}
        </div>
      );
  }
});

const AudioTimelineItem = observer(({ file, files }: { file: AudioFile; files: AudioFile[] }) => {
  const { controls, gap } = useContext(AudioTimelineContext);

  const [start, setStart] = useState(() => Math.max(file.timeline.start, 0));
  const [end, setEnd] = useState(() => Math.min(file.timeline.end, controls.duration));

  const [resize, setResize] = useState<'left' | 'right' | null>(null);
  const [resizeX, setResizeX] = useState(0);

  const east$ = useRef<HTMLButtonElement>(null);
  const west$ = useRef<HTMLButtonElement>(null);
  const main$ = useRef<HTMLButtonElement>(null);

  const handleResizeStart = useCallback((direction: 'left' | 'right', event: React.PointerEvent<HTMLButtonElement>) => {
    setResize(direction);
    setResizeX(event.clientX);
  }, []);

  const handleResize = useCallback(
    (event: PointerEvent) => {
      if (!main$.current) return;

      switch (resize) {
        case 'left': {
          const delta = (event.clientX - resizeX) * 0.01;
          setStart((state) => Math.min(state + delta / gap, end));
          break;
        }
        case 'right': {
          const rect = main$.current.getBoundingClientRect();
          const delta = event.clientX - rect.left;
          setEnd(Math.max(delta / gap, start + MinimumAudioDurationSeconds));
          break;
        }
      }
    },
    [start, end, gap, resize, resizeX]
  );

  const handleResizeEnd = useCallback(() => {
    setResize(null);
  }, []);

  useEffect(() => {
    document.addEventListener('pointermove', handleResize);
    document.addEventListener('pointerup', handleResizeEnd);
    return () => {
      document.removeEventListener('pointermove', handleResize);
      document.removeEventListener('pointerup', handleResizeEnd);
    };
  }, [handleResize, handleResizeEnd]);

  const selected = editor.audio.selected === file.id;
  const duration = Math.min(end - start, controls.duration);

  const isModifyStartDisabled = start <= 0;
  const isModifyEndDisabled = end >= controls.duration || end >= file.duration;

  return (
    <div className="relative h-full shrink-0" style={{ width: gap * duration }}>
      {selected ? (
        <button
          ref={east$}
          onPointerDown={(event) => handleResizeStart('left', event)}
          className={cn('absolute top-0 left-0 w-3.5 h-full bg-violet-600 grid place-items-center cursor-ew-resize z-10', isModifyStartDisabled ? 'rounded-l-none' : 'rounded-l-md')}
        >
          <span className="h-3 w-0.5 rounded-md bg-white" />
        </button>
      ) : null}
      <button
        ref={main$}
        onClick={() => editor.audio.selectAudioFileToggle(file.id)}
        className={cn(
          'h-full w-full shrink-0 bg-gradient-to-b from-violet-500/60 to-violet-500/80 border-2 border-violet-600 flex items-end py-1.5 relative overflow-hidden',
          selected ? 'px-6' : 'px-4'
        )}
      >
        <div className="flex items-center gap-1.5">
          <MusicNotes size={14} weight="fill" className="text-white" />
          <span className="text-xs font-medium text-white leading-none">{file.file.name}</span>
        </div>
      </button>
      {selected ? (
        <button
          ref={west$}
          onPointerDown={(event) => handleResizeStart('right', event)}
          className={cn('absolute top-0 right-0 w-3.5 h-full bg-violet-600 grid place-items-center cursor-ew-resize z-10', isModifyEndDisabled ? 'rounded-r-none' : 'rounded-r-md')}
        >
          <span className="h-3 w-0.5 rounded-md bg-white" />
        </button>
      ) : null}
    </div>
  );
});

export { AudioFooter };
