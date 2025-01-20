import clsx from 'clsx';
import css from 'styled-jsx/css';
import sonner from 'sonner/dist/styles.css?inline';

import { observer } from 'mobx-react';
import { Toaster } from 'sonner';
import { animations, ResolvedStyle, theme, ThemeProvider } from '@rekorder.io/ui';

import { CameraPreview } from './components/camera';
import { Cursors } from './components/cursor';
import { EditorArea } from './components/editor';
import { Overlay } from './components/overlay';
import { Permission } from './components/permission';
import { PluginCard } from './components/plugin/plugin';
import { TimerCountdown } from './components/timer';
import { PluginToolbar } from './components/toolbar/toolbar';

import { recorder } from './store/recorder';
import { useCloseExtensionListener } from './hooks/use-close-extension';
import { SAFE_AREA_PADDING_SMALL } from './constants/layout';

const RecorderCSS = css.resolve`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .rekorder-area {
    inset: 0;
    opacity: 0;
    position: fixed;
    pointer-events: none;

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
  useCloseExtensionListener();

  if (!recorder.initialized) {
    return null;
  }

  return (
    <ThemeProvider>
      <style>{sonner}</style>
      <ResolvedStyle>{RecorderCSS}</ResolvedStyle>
      <section id="rekorder-area" className={clsx(RecorderCSS.className, 'rekorder-area')}>
        <Overlay />
        <Permission />
        <div className={clsx(RecorderCSS.className, 'rekorder-container')}>
          <PluginCard />
          <PluginToolbar />
          <CameraPreview />
          <TimerCountdown />
          <Toaster position="bottom-right" richColors offset={SAFE_AREA_PADDING_SMALL} />
        </div>
        <Cursors />
        <EditorArea />
      </section>
    </ThemeProvider>
  );
});

export { Content };
