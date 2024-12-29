import clsx from 'clsx';
import css from 'styled-jsx/css';
import { AnimationsProvider, theme } from '@rekorder.io/ui';

import { PluginCard } from './components/plugin/plugin';
import { CameraPreview } from './components/camera';
import { PluginToolbar } from './components/toolbar/toolbar';
import { Timer } from './components/timer';

const RecorderCSS = css.resolve`
  * {
    margin: 0;
    box-sizing: border-box;
    padding: 0;
  }

  .rekorder-container {
    position: fixed;
    inset: 0;
    pointer-events: none;

    z-index: ${theme.zIndex(1)};
    background-color: ${theme.alpha(theme.colors.core.black, 0.1)};
  }
`;

export function Recorder() {
  return (
    <AnimationsProvider>
      {RecorderCSS.styles}
      <section className={clsx(RecorderCSS.className, 'rekorder-container')}>
        <PluginCard />
        <PluginToolbar />
        <CameraPreview />
        <Timer />
      </section>
    </AnimationsProvider>
  );
}
