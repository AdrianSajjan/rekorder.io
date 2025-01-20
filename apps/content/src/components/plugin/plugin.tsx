import clsx from 'clsx';
import css from 'styled-jsx/css';
import Draggable from 'react-draggable';

import { observer } from 'mobx-react';
import { Fragment, useState } from 'react';
import { AnimatePresence, motion, Variants } from 'motion/react';

import { DotsThree, QuestionMark, X } from '@phosphor-icons/react';
import { EventConfig } from '@rekorder.io/constants';
import { AnimateHeight, Brand, Button, HorizontalTabs, ResolvedStyle, theme } from '@rekorder.io/ui';

import { AudioPlugin } from './audio';
import { ScreenPlugin } from './screen';
import { CameraPlugin } from './camera';

import { recorder } from '../../store/recorder';
import { closeExtension, framerMotionRoot } from '../../lib/utils';

import { useDragControls } from '../../hooks/use-drag-controls';
import { useDisposeEvents } from '../../hooks/use-dispose-events';

const PluginCardCSS = css.resolve`
  .rekorder-plugin-container {
    user-select: none;
    position: absolute;
    pointer-events: all;
    width: ${theme.space(85)};
  }

  .rekorder-plugin-card {
    width: 100%;
    border-radius: ${theme.space(4)};

    border: 1px solid ${theme.colors.borders.input};
    background-color: ${theme.colors.core.white};
    box-shadow: ${theme.shadow(theme.alpha(theme.colors.accent.light, 0.1)).xl};
  }

  .rekorder-card-header {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space(6)} ${theme.space(6)};
  }

  .rekorder-card-actions {
    top: -15px;
    right: -15px;
    position: absolute;

    display: flex;
    align-items: center;
    border-radius: 999px;

    padding: ${theme.space(1)};
    border: 1px solid ${theme.colors.borders.input};
    background-color: ${theme.colors.card.background};
  }

  .rekorder-action-button {
    border: none;
    display: flex;
    cursor: pointer;

    align-items: center;
    justify-content: center;
    background-color: transparent;
    transition: background-color 250ms ease-out;

    width: ${theme.space(7)};
    height: ${theme.space(7)};
    border-radius: ${theme.space(7)};
    color: ${theme.colors.card.text};
  }

  .rekorder-action-button:hover {
    background-color: ${theme.colors.background.main};
  }

  .rekorder-action-button:focus-visible {
    outline: none;
    box-shadow: ${theme.ring({ ring: { color: theme.alpha(theme.colors.primary.main, 0.5) } })};
  }

  .rekorder-horizontal-panel {
    position: relative;
    background-color: ${theme.colors.background.light};
  }

  .rekorder-horizontal-panel-content {
    overflow-y: auto;
    padding: ${theme.space(6)};
    max-height: ${theme.space(56)};
  }

  .rekorder-footer {
    display: flex;
    flex-direction: column;
    gap: ${theme.space(3)};
    border-top: 1px solid ${theme.colors.borders.input};
    padding: ${theme.space(6)} ${theme.space(6)};
  }

  .rekorder-record-button {
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

const TabOrder = ['screen', 'camera', 'audio'];

const PluginCardHOC = observer(() => {
  if (recorder.status === 'idle' || recorder.status === 'countdown' || recorder.status === 'error') {
    return <PluginCard />;
  } else {
    return null;
  }
});

const PluginCard = observer(() => {
  const handleDisposeEvents = useDisposeEvents();
  const drag = useDragControls<HTMLDivElement>({ position: 'top-right', dimension: { height: 380, width: 350 } });

  const [tab, setTab] = useState<'screen' | 'camera' | 'audio'>('screen');
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);

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

  const handleTabChange = (value: string) => {
    setTab(value as 'screen' | 'camera' | 'audio');
    setDirection(TabOrder.indexOf(value) > TabOrder.indexOf(tab) ? 1 : -1);
  };

  const handleCloseExtension = () => {
    handleDisposeEvents();
    chrome.runtime.sendMessage({ type: EventConfig.CloseExtension });
    closeExtension();
  };

  return (
    <Fragment>
      <ResolvedStyle>{PluginCardCSS}</ResolvedStyle>
      <Draggable nodeRef={drag.ref} position={drag.position} onStop={drag.onChangePosition} bounds={drag.bounds}>
        <div ref={drag.ref} className={clsx(PluginCardCSS.className, 'rekorder-plugin-container')}>
          <article className={clsx(PluginCardCSS.className, 'rekorder-plugin-card')}>
            <div className={clsx(PluginCardCSS.className, 'rekorder-card-header')}>
              <Brand mode="expanded" height={30} />
            </div>
            <div className={clsx(PluginCardCSS.className, 'rekorder-card-actions')}>
              <button className={clsx(PluginCardCSS.className, 'rekorder-action-button')}>
                <DotsThree weight="bold" size={14} />
              </button>
              <button className={clsx(PluginCardCSS.className, 'rekorder-action-button')}>
                <QuestionMark weight="bold" size={14} />
              </button>
              <button onClick={handleCloseExtension} className={clsx(PluginCardCSS.className, 'rekorder-action-button')}>
                <X weight="bold" size={14} />
              </button>
            </div>
            <HorizontalTabs value={tab} onValueChange={handleTabChange}>
              <HorizontalTabs.List>
                <HorizontalTabs.Trigger value="screen">Screen</HorizontalTabs.Trigger>
                <HorizontalTabs.Trigger value="camera">Camera</HorizontalTabs.Trigger>
                <HorizontalTabs.Trigger value="audio">Audio</HorizontalTabs.Trigger>
              </HorizontalTabs.List>
              <AnimateHeight className={clsx(PluginCardCSS.className, 'rekorder-horizontal-panel')}>
                <AnimatePresence mode="popLayout" initial={false} custom={direction} root={framerMotionRoot()}>
                  <motion.div
                    key={tab}
                    exit="exit"
                    initial="initial"
                    animate="active"
                    custom={direction}
                    variants={variants}
                    transition={transition}
                    className={clsx(PluginCardCSS.className, 'rekorder-horizontal-panel-content')}
                  >
                    <HorizontalTabs.Panel value="screen">
                      <ScreenPlugin />
                    </HorizontalTabs.Panel>
                    <HorizontalTabs.Panel value="camera">
                      <CameraPlugin />
                    </HorizontalTabs.Panel>
                    <HorizontalTabs.Panel value="audio">
                      <AudioPlugin />
                    </HorizontalTabs.Panel>
                  </motion.div>
                </AnimatePresence>
              </AnimateHeight>
            </HorizontalTabs>
            <div className={clsx(PluginCardCSS.className, 'rekorder-footer')}>
              <Button variant="fancy" onClick={handleScreenCapture} className={clsx(PluginCardCSS.className, 'rekorder-record-button')}>
                <span>{recorder.status === 'countdown' ? 'Cancel Recording' : 'Start Recording'}</span>
                <span className={clsx(PluginCardCSS.className, 'rekorder-record-button-command')}>⌥⇧D</span>
              </Button>
            </div>
          </article>
        </div>
      </Draggable>
    </Fragment>
  );
});

const transition = {
  duration: 0.5,
  type: 'spring',
  bounce: 0,
};

const variants: Variants = {
  initial: (direction: number) => {
    return {
      opacity: 0,
      x: 110 * direction + '%',
    };
  },
  active: {
    x: '0%',
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      opacity: 0,
      x: -110 * direction + '%',
    };
  },
};

export { PluginCardHOC as PluginCard };
