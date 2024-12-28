import Draggable from 'react-draggable';

import { observer } from 'mobx-react';
import { useRef } from 'react';
import css from 'styled-jsx/css';
import { HandGrabbing, SquaresFour, Video } from '@phosphor-icons/react';

import { useWindowDimensions } from '@rekorder.io/hooks';
import { Button, Divider, SegmentedControl } from '@rekorder.io/ui';

import { measureElement } from '../../lib/utils';
import { recorder } from '../../store/recorder';
import { SAFE_AREA_PADDING } from '../../constants/layout';
import clsx from 'clsx';

const PluginCardCSS = css.resolve`
  .container {
  }

  .card {
  }
`;

const PluginCardHOC = observer(() => {
  if (recorder.status === 'idle' || recorder.status === 'pending' || recorder.status === 'error') {
    return <PluginCard />;
  } else {
    return null;
  }
});

const PluginCard = observer(() => {
  const plugin$ = useRef<HTMLDivElement>(null!); // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const { height: pluginHeight, width: pluginWidth } = measureElement(plugin$.current, { height: 526, width: 448 });

  const handleScreenCapture = () => {
    switch (recorder.status) {
      case 'pending':
        recorder.cancelScreenCapture();
        break;
      case 'idle':
        recorder.startScreenCapture();
        break;
    }
  };

  const defaultPosition = {
    x: screenWidth - pluginWidth - SAFE_AREA_PADDING,
    y: SAFE_AREA_PADDING,
  };

  const bounds = {
    left: SAFE_AREA_PADDING,
    top: SAFE_AREA_PADDING,
    right: screenWidth - pluginWidth - SAFE_AREA_PADDING,
    bottom: screenHeight - pluginHeight - SAFE_AREA_PADDING,
  };

  return (
    <Draggable nodeRef={plugin$} handle="#plugin-handle" defaultPosition={defaultPosition} bounds={bounds}>
      <div ref={plugin$} className={clsx(PluginCardCSS.className, 'container')}>
        <article className={clsx(PluginCardCSS.className, 'card')}>
          <SegmentedControl defaultValue="record">
            <SegmentedControl.List>
              <SegmentedControl.Trigger value="record">
                <SegmentedControl.TriggerIcon>
                  <Video size={20} />
                </SegmentedControl.TriggerIcon>
                <span>Record</span>
              </SegmentedControl.Trigger>
              <SegmentedControl.Trigger value="video">
                <SegmentedControl.TriggerIcon>
                  <SquaresFour size={20} />
                </SegmentedControl.TriggerIcon>
                <span>Videos</span>
              </SegmentedControl.Trigger>
            </SegmentedControl.List>
            <SegmentedControl.Panel value="record">
              <div className="p-0"></div>
              <Divider />
              <div className="pt-5">
                <Button onClick={handleScreenCapture}>
                  <span>{recorder.status === 'pending' ? 'Cancel Recording' : 'Start Recording'}</span>
                  <span>⌥⇧D</span>
                </Button>
              </div>
            </SegmentedControl.Panel>
            <SegmentedControl.Panel value="video">
              <div>Coming Soon!</div>
            </SegmentedControl.Panel>
          </SegmentedControl>
        </article>
      </div>
    </Draggable>
  );
});

export { PluginCardHOC as PluginCard };
