import clsx from 'clsx';
import css from 'styled-jsx/css';
import { Fragment } from 'react/jsx-runtime';

import { PluginCard } from './components/plugin/plugin';
import { theme } from '@rekorder.io/ui';
// import { CameraPreview } from './components/camera';
// import { PluginToolbar } from './components/toolbar/toolbar';
// import { Timer } from './components/timer';

const RecorderCSS = css.resolve`
  .container {
    width: 100vw;
    height: 100vh;
    z-index: ${theme.zIndex(1)};
  }
`;

export function Recorder() {
  return (
    <Fragment>
      {RecorderCSS.styles}
      <section className={clsx(RecorderCSS.className, 'container')}>
        <PluginCard />
        {/* <PluginToolbar />
      <CameraPreview />
      <Timer /> */}
      </section>
    </Fragment>
  );
}
