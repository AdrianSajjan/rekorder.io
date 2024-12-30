import clsx from 'clsx';
import css from 'styled-jsx/css';

import { Toaster } from 'sonner';
import { AnimationsProvider, theme } from '@rekorder.io/ui';

import { CameraPreview } from './components/camera';
import { PluginCard } from './components/plugin/plugin';
import { PluginToolbar } from './components/toolbar/toolbar';

import { Overlay } from './components/overlay';
import { TimerCountdown } from './components/timer';
import { SAFE_AREA_PADDING } from './constants/layout';

const RecorderCSS = css.resolve`
  * {
    margin: 0;
    box-sizing: border-box;
    padding: 0;
  }

  .rekorder-container {
    inset: 0;
    position: fixed;
    pointer-events: none;
    z-index: ${theme.zIndex(1)};
  }
`;

export function Recorder() {
  return (
    <AnimationsProvider>
      {RecorderCSS.styles}
      <Overlay />
      <section className={clsx(RecorderCSS.className, 'rekorder-container')}>
        <PluginCard />
        <PluginToolbar />
        <CameraPreview />
        <TimerCountdown />
      </section>
      <Toaster position="bottom-right" richColors offset={SAFE_AREA_PADDING} />
    </AnimationsProvider>
  );
}
