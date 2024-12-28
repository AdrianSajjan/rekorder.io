import clsx from 'clsx';
import css from 'styled-jsx/css';
import { AnimationsProvider, theme } from '@rekorder.io/ui';

import { PluginCard } from './components/plugin/plugin';
import { Timer } from './components/timer';
import { CameraPreview } from './components/camera';
// import { PluginToolbar } from './components/toolbar/toolbar';

const RecorderCSS = css.resolve`
  .container {
    width: 100vw;
    height: 100vh;
    position: fixed;

    pointer-events: none;
    z-index: ${theme.zIndex(1)};
    background-color: ${theme.alpha(theme.colors.core.black, 0.1)};
  }
`;

export function Recorder() {
  return (
    <AnimationsProvider>
      {RecorderCSS.styles}
      <section className={clsx(RecorderCSS.className, 'container')}>
        <PluginCard />
        {/* <PluginToolbar /> */}
        <CameraPreview />
        <Timer />
      </section>
    </AnimationsProvider>
  );
}
