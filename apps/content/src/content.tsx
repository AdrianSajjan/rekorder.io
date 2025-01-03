import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Toaster } from 'sonner';
import { observer } from 'mobx-react';
import { AnimationsProvider, theme, animations } from '@rekorder.io/ui';

import { CameraPreview } from './components/camera';
import { Permission } from './components/permission';
import { Overlay } from './components/overlay';
import { TimerCountdown } from './components/timer';
import { EditorArea } from './components/editor';
import { Cursors } from './components/cursor';
import { PluginCard } from './components/plugin/plugin';
import { PluginToolbar } from './components/toolbar/toolbar';

import { SAFE_AREA_PADDING } from './constants/layout';
import { recorder } from './store/recorder';

const RecorderCSS = css.resolve`
  * {
    margin: 0;
    box-sizing: border-box;
    padding: 0;
  }

  .rekorder-area {
    opacity: 0;
    position: fixed;
    z-index: ${theme.zIndex(1)};
    animation: ${animations['fade-in']} cubic-bezier(0.2, 0.5, 0.1, 0.8) 150ms forwards;
  }

  .rekorder-container {
    inset: 0;
    z-index: 3;
    position: fixed;
    pointer-events: none;
  }
`;

const Content = observer(() => {
  return recorder.initialized ? (
    <AnimationsProvider>
      {RecorderCSS.styles}
      <section className={clsx(RecorderCSS.className, 'rekorder-area')}>
        <Overlay />
        <EditorArea />
        <Cursors />
        <div className={clsx(RecorderCSS.className, 'rekorder-container')}>
          <PluginCard />
          <PluginToolbar />
          <CameraPreview />
          <TimerCountdown />
        </div>
        <Permission />
        <Toaster position="bottom-right" richColors offset={SAFE_AREA_PADDING} />
      </section>
    </AnimationsProvider>
  ) : null;
});

export { Content };
