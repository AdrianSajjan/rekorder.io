import { observer } from 'mobx-react';
import { FastForward, MagnifyingGlassMinus, MagnifyingGlassPlus, Pause, Play, Scissors, Trash } from '@phosphor-icons/react';

import { Button, Tooltip } from '@rekorder.io/ui';
import { useMeasure, useVideoControls } from '@rekorder.io/hooks';
import { cn, formatSecondsToMMSS } from '@rekorder.io/utils';

import { HEADER_HEIGHT } from '../../../constants/layout';
import { editor } from '../../../store/editor';

const AudioFooter = observer(() => {
  const { controls, handleTogglePlayback, handleSeek } = useVideoControls(editor.elementOrThrow);

  const [container$, bounds] = useMeasure<HTMLDivElement>();

  const gap = bounds.width / controls.duration;

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
      <div className="flex-1 relative overflow-auto" id="timeline" ref={container$}>
        <div className="w-full h-fit flex px-4">
          {Array.from({ length: Math.round(controls.duration + 1) }, (_, key) => (
            <div key={key} className="flex flex-col" style={{ width: key === Math.round(controls.duration) ? 0 : gap }}>
              {key < controls.duration - 1 ? (
                <div className="flex items-start w-full justify-between mb-1">
                  {Array.from({ length: 10 }, (_, index) => (
                    <div
                      key={index}
                      className={cn(
                        'w-px border-l-2 border-text-muted',
                        index === 0 || index === 9 ? 'h-3' : index === 5 ? 'h-2.5' : 'h-2',
                        key > 0 ? (index === 0 ? 'opacity-0' : 'opacity-100') : 'opacity-100'
                      )}
                    />
                  ))}
                </div>
              ) : null}
              <span
                className={cn(
                  'text-xs w-fit mt-auto shrink-0 tabular-nums text-accent-dark',
                  key > 0 ? (key === Math.round(controls.duration) ? '-translate-x-full' : '-translate-x-1/2') : 'translate-x-0'
                )}
              >
                {formatSecondsToMMSS(key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Tooltip.Provider>
  );
});

export { AudioFooter };
