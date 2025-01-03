import css from 'styled-jsx/css';
import clsx from 'clsx';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { animations, Switch, theme } from '@rekorder.io/ui';
import { recorder } from '../../store/recorder';

const ScreenPluginCSS = css.resolve`
  .rekorder-screen-container {
    display: flex;
    flex-direction: column;
    gap: ${theme.space(5)};

    animation-name: ${animations['fade-in']};
    animation-duration: 300ms;
    animation-timing-function: ease-out;
  }

  .toggle-control {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space(3)};
  }

  .toggle-control-label {
    font-size: 14px;
    color: ${theme.colors.background.text};
  }
`;

const ScreenPlugin = observer(() => {
  return (
    <Fragment>
      {ScreenPluginCSS.styles}
      <div className={clsx(ScreenPluginCSS.className, 'rekorder-screen-container')}>
        <div className={clsx('toggle-control', ScreenPluginCSS.className)}>
          <label htmlFor="capture-device-audio" className={clsx(ScreenPluginCSS.className, 'toggle-control-label')}>
            Capture Device Audio
          </label>
          <Switch id="capture-device-audio" checked={recorder.audio} onCheckedChange={recorder.changeDesktopAudio} />
        </div>
        <div className={clsx('toggle-control', ScreenPluginCSS.className)}>
          <label htmlFor="zoom-on-click" className={clsx(ScreenPluginCSS.className, 'toggle-control-label')}>
            Zoom on Click
          </label>
          <Switch id="zoom-on-click" disabled />
        </div>
      </div>
    </Fragment>
  );
});

export { ScreenPlugin };
