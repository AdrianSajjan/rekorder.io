import css from 'styled-jsx/css';
import clsx from 'clsx';

import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';
import { animations, Switch, theme } from '@rekorder.io/ui';

const ScreenPluginCSS = css.resolve`
  .container {
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
  }
`;

const ScreenPlugin = observer(() => {
  return (
    <Fragment>
      {ScreenPluginCSS.styles}
      <div className={clsx(ScreenPluginCSS.className, 'container')}>
        <div className={clsx('toggle-control', ScreenPluginCSS.className)}>
          <label htmlFor="capture-device-audio" className={clsx(ScreenPluginCSS.className, 'toggle-control-label')}>
            Capture Device Audio
          </label>
          <Switch id="capture-device-audio" />
        </div>
        <div className={clsx('toggle-control', ScreenPluginCSS.className)}>
          <label htmlFor="zoom-on-click" className={clsx(ScreenPluginCSS.className, 'toggle-control-label')}>
            Zoom on Click
          </label>
          <Switch id="zoom-on-click" />
        </div>
      </div>
    </Fragment>
  );
});

export { ScreenPlugin };
