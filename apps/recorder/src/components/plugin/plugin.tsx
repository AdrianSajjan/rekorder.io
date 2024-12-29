import clsx from 'clsx';
import Draggable from 'react-draggable';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment, useRef } from 'react';
import { SquaresFour, VideoCamera } from '@phosphor-icons/react';

import { useWindowDimensions } from '@rekorder.io/hooks';
import { AnimateHeight, Button, HorizontalTabs, SegmentedControl, theme } from '@rekorder.io/ui';

import { measureElement } from '../../lib/utils';
import { recorder } from '../../store/recorder';
import { SAFE_AREA_PADDING } from '../../constants/layout';

import { CameraPlugin } from './camera';
import { AudioPlugin } from './audio';
import { ScreenPlugin } from './screen';
import { ToolbarPlugin } from './toolbar';

const PluginCardCSS = css.resolve`
  .rekorder-plugin-container {
    position: absolute;
    width: 100%;
    max-width: ${theme.screens.xs}px;
    pointer-events: all;
  }

  .card {
    width: 100%;
    padding-top: ${theme.space(8)};
    padding-bottom: ${theme.space(6)};

    box-shadow: ${theme.shadow().lg};
    border: 1px solid ${theme.colors.borders.input};
    background-color: ${theme.colors.core.white};
    border-radius: ${theme.space(4)};
  }

  .segmented-list {
    margin: 0 auto;
    width: ${theme.space(70)} !important;
  }

  .segmented-panel {
    margin-top: ${theme.space(5)};
  }

  .horizontal-panel {
    padding: ${theme.space(6)};
    background-color: ${theme.colors.background.light};
  }

  .footer {
    border-top: 1px solid ${theme.colors.borders.input};
    padding: ${theme.space(6)} ${theme.space(6)} 0;
  }

  .record-button {
    width: 100%;
    position: relative;
  }

  .record-button-command {
    top: 50%;
    position: absolute;
    right: ${theme.space(4)};
    transform: translateY(-50%);

    font-size: 12px;
    font-weight: 400;
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
  const plugin$ = useRef<HTMLDivElement>(null!);

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
    <Fragment>
      {PluginCardCSS.styles}
      <Draggable nodeRef={plugin$} defaultPosition={defaultPosition} bounds={bounds}>
        <div ref={plugin$} className={clsx(PluginCardCSS.className, 'rekorder-plugin-container')}>
          <article className={clsx(PluginCardCSS.className, 'card')}>
            <SegmentedControl
              size="small"
              className={clsx(PluginCardCSS.className, 'segmented-controls')}
              defaultValue="record"
            >
              <SegmentedControl.List className={clsx(PluginCardCSS.className, 'segmented-list')}>
                <SegmentedControl.Trigger value="record">
                  <SegmentedControl.TriggerIcon>
                    <VideoCamera weight="fill" size={20} />
                  </SegmentedControl.TriggerIcon>
                  <span>Record</span>
                </SegmentedControl.Trigger>
                <SegmentedControl.Trigger value="video" disabled>
                  <SegmentedControl.TriggerIcon>
                    <SquaresFour size={20} />
                  </SegmentedControl.TriggerIcon>
                  <span>Videos</span>
                </SegmentedControl.Trigger>
              </SegmentedControl.List>
              <SegmentedControl.Panel value="record" className={clsx(PluginCardCSS.className, 'segmented-panel')}>
                <HorizontalTabs defaultValue="screen">
                  <HorizontalTabs.List>
                    <HorizontalTabs.Trigger value="screen">Screen</HorizontalTabs.Trigger>
                    <HorizontalTabs.Trigger value="camera">Camera</HorizontalTabs.Trigger>
                    <HorizontalTabs.Trigger value="audio">Audio</HorizontalTabs.Trigger>
                    <HorizontalTabs.Trigger value="toolbar">Toolbar</HorizontalTabs.Trigger>
                  </HorizontalTabs.List>
                  <div className={clsx(PluginCardCSS.className, 'horizontal-panel')}>
                    <AnimateHeight>
                      <HorizontalTabs.Panel value="screen">
                        <ScreenPlugin />
                      </HorizontalTabs.Panel>
                      <HorizontalTabs.Panel value="camera">
                        <CameraPlugin />
                      </HorizontalTabs.Panel>
                      <HorizontalTabs.Panel value="audio">
                        <AudioPlugin />
                      </HorizontalTabs.Panel>
                      <HorizontalTabs.Panel value="toolbar">
                        <ToolbarPlugin />
                      </HorizontalTabs.Panel>
                    </AnimateHeight>
                  </div>
                </HorizontalTabs>
                <div className={clsx(PluginCardCSS.className, 'footer')}>
                  <Button onClick={handleScreenCapture} className={clsx(PluginCardCSS.className, 'record-button')}>
                    <span>{recorder.status === 'pending' ? 'Cancel Recording' : 'Start Recording'}</span>
                    <span className={clsx(PluginCardCSS.className, 'record-button-command')}>⌥⇧D</span>
                  </Button>
                </div>
              </SegmentedControl.Panel>
            </SegmentedControl>
          </article>
        </div>
      </Draggable>
    </Fragment>
  );
});

export { PluginCardHOC as PluginCard };
