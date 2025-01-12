import clsx from 'clsx';
import Draggable from 'react-draggable';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { Fragment } from 'react';

import { SquaresFour, VideoCamera } from '@phosphor-icons/react';
import { AnimateHeight, Button, HorizontalTabs, SegmentedControl, theme } from '@rekorder.io/ui';
import { EventConfig } from '@rekorder.io/constants';

import { recorder } from '../../store/recorder';
import { RECORDER_ROOT } from '../../constants/layout';
import { useDragControls } from '../../hooks/use-drag-controls';
import { useDisposeEvents } from '../../hooks/use-dispose-events';

import { AudioPlugin } from './audio';
import { CameraPlugin } from './camera';
import { ScreenPlugin } from './screen';
import { ToolbarPlugin } from './toolbar';

const PluginCardCSS = css.resolve`
  .rekorder-plugin-container {
    position: absolute;
    width: fit-content;
    pointer-events: all;
  }

  .rekorder-plugin-card {
    width: 100%;
    padding-top: ${theme.space(8)};
    padding-bottom: ${theme.space(6)};
    border-radius: ${theme.space(4)};

    border: 1px solid ${theme.colors.borders.input};
    background-color: ${theme.colors.core.white};
    box-shadow: ${theme.shadow(theme.alpha(theme.colors.accent.light, 0.1)).xl};
  }

  .rekorder-segmented-list {
    margin: 0 auto;
    width: ${theme.space(70)} !important;
  }

  .rekorder-segmented-panel {
    margin-top: ${theme.space(5)};
  }

  .rekorder-horizontal-panel {
    background-color: ${theme.colors.background.light};
  }

  .rekorder-horizontal-panel-content {
    padding: ${theme.space(6)};
    max-height: ${theme.space(60)};
    overflow-y: auto;
  }

  .rekorder-footer {
    display: flex;
    flex-direction: column;
    gap: ${theme.space(3)};
    border-top: 1px solid ${theme.colors.borders.input};
    padding: ${theme.space(6)} ${theme.space(6)} 0;
  }

  .rekorder-record-button,
  .rekorder-close-button {
    width: 100%;
    position: relative;
  }

  .rekorder-record-button-command {
    top: 50%;
    position: absolute;
    right: ${theme.space(4)};
    transform: translateY(-50%);

    font-size: 12px;
    font-weight: 400;
  }
`;

const PluginCardHOC = observer(() => {
  if (recorder.status === 'idle' || recorder.status === 'countdown' || recorder.status === 'error') {
    return <PluginCard />;
  } else {
    return null;
  }
});

const PluginCard = observer(() => {
  const handleDisposeEvents = useDisposeEvents();
  const drag = useDragControls<HTMLDivElement>({ position: 'top-right', dimension: { height: 350, width: 375 } });

  const handleScreenCapture = () => {
    switch (recorder.status) {
      case 'countdown':
        recorder.cancelScreenCapture();
        break;
      case 'idle':
      case 'error':
        recorder.startScreenCapture();
        break;
    }
  };

  const handleCloseExtension = () => {
    handleDisposeEvents();
    chrome.runtime.sendMessage({ type: EventConfig.CloseExtension });
    window.__rekorder__ = false;
    document.getElementById(RECORDER_ROOT)?.remove();
  };

  return (
    <Fragment>
      {PluginCardCSS.styles}
      <Draggable nodeRef={drag.ref} position={drag.position} onStop={drag.onChangePosition} bounds={drag.bounds}>
        <div ref={drag.ref} className={clsx(PluginCardCSS.className, 'rekorder-plugin-container')}>
          <article className={clsx(PluginCardCSS.className, 'rekorder-plugin-card')}>
            <SegmentedControl size="small" className={clsx(PluginCardCSS.className, 'rekorder-segmented-controls')} defaultValue="record">
              <SegmentedControl.List className={clsx(PluginCardCSS.className, 'rekorder-segmented-list')}>
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
              <SegmentedControl.Panel value="record" className={clsx(PluginCardCSS.className, 'rekorder-segmented-panel')}>
                <HorizontalTabs defaultValue="screen">
                  <HorizontalTabs.List>
                    <HorizontalTabs.Trigger value="screen">Screen</HorizontalTabs.Trigger>
                    <HorizontalTabs.Trigger value="camera">Camera</HorizontalTabs.Trigger>
                    <HorizontalTabs.Trigger value="audio">Audio</HorizontalTabs.Trigger>
                    <HorizontalTabs.Trigger disabled value="toolbar">
                      Toolbar
                    </HorizontalTabs.Trigger>
                  </HorizontalTabs.List>
                  <AnimateHeight className={clsx(PluginCardCSS.className, 'rekorder-horizontal-panel')}>
                    <div className={clsx(PluginCardCSS.className, 'rekorder-horizontal-panel-content')}>
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
                    </div>
                  </AnimateHeight>
                </HorizontalTabs>
                <div className={clsx(PluginCardCSS.className, 'rekorder-footer')}>
                  <Button variant="fancy" onClick={handleScreenCapture} className={clsx(PluginCardCSS.className, 'rekorder-record-button')}>
                    <span>{recorder.status === 'pending' ? 'Cancel Recording' : 'Start Recording'}</span>
                    <span className={clsx(PluginCardCSS.className, 'rekorder-record-button-command')}>⌥⇧D</span>
                  </Button>
                  <Button variant="outline" color="accent" onClick={handleCloseExtension} className={clsx(PluginCardCSS.className, 'rekorder-close-button')}>
                    Close Extension
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
