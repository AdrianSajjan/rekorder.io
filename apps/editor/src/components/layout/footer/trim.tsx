import { observer } from 'mobx-react';
import { Button } from '@rekorder.io/ui';
import { Fragment } from 'react/jsx-runtime';
import { ArrowsHorizontal, FastForward, Play, Scissors } from '@phosphor-icons/react';

import { HEADER_HEIGHT } from '../../../constants/layout';
import { Slider } from '../../ui/slider';

const TrimFooter = observer(() => {
  return (
    <Fragment>
      <div className="flex items-center shrink-0 justify-between px-4 border-b border-borders-input" style={{ height: HEADER_HEIGHT }}>
        <div className="flex items-center gap-4 min-w-48">
          <Button size="small" variant="light" color="accent">
            <Scissors weight="fill" size={16} />
            <span>Trim Audio</span>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" color="accent">
            <FastForward weight="fill" size={16} className="rotate-180" />
          </Button>
          <p className="text-sm text-card-text">00:10</p>
          <Button size="icon" variant="outline" color="accent">
            <Play weight="fill" size={16} />
          </Button>
          <p className="text-sm text-card-text font-medium">00:50</p>
          <Button size="icon" variant="ghost" color="accent">
            <FastForward weight="fill" size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-4 min-w-48">
          <ArrowsHorizontal weight="bold" size={16} className="shrink-0" />
          <Slider trackClassName="h-1.5" rangeClassName="bg-accent-main" thumbClassName="border-accent-main h-4 w-4" />
        </div>
      </div>
      <div className="flex-1"></div>
    </Fragment>
  );
});

export { TrimFooter };
