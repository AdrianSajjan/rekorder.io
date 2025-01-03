import clsx from 'clsx';
import css from 'styled-jsx/css';

import { animations, Switch, theme } from '@rekorder.io/ui';
import { observer } from 'mobx-react';
import { Fragment } from 'react/jsx-runtime';

const ToolbarPluginCSS = css.resolve`
  .rekorder-toolbar-plugin-container {
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

const ToolbarPlugin = observer(() => {
  return (
    <Fragment>
      {ToolbarPluginCSS.styles}
      <div className={clsx(ToolbarPluginCSS.className, 'rekorder-toolbar-plugin-container')}>
        <div className={clsx(ToolbarPluginCSS.className, 'toggle-control')}>
          <label className={clsx(ToolbarPluginCSS.className, 'toggle-control-label')} htmlFor="hide-toolbar">
            Enabled
          </label>
          <Switch id="hide-toolbar" />
        </div>
        <div className={clsx(ToolbarPluginCSS.className, 'toggle-control')}>
          <label className={clsx(ToolbarPluginCSS.className, 'toggle-control-label')} htmlFor="camera-controls">
            Camera Controls
          </label>
          <Switch id="camera-controls" />
        </div>
        <div className={clsx(ToolbarPluginCSS.className, 'toggle-control')}>
          <label className={clsx(ToolbarPluginCSS.className, 'toggle-control-label')} htmlFor="mic-controls">
            Microphone Controls
          </label>
          <Switch id="mic-controls" />
        </div>
        <div className={clsx(ToolbarPluginCSS.className, 'toggle-control')}>
          <label className={clsx(ToolbarPluginCSS.className, 'toggle-control-label')} htmlFor="cursor-controls">
            Cursor Controls
          </label>
          <Switch id="cursor-controls" />
        </div>
        <div className={clsx(ToolbarPluginCSS.className, 'toggle-control')}>
          <label className={clsx(ToolbarPluginCSS.className, 'toggle-control-label')} htmlFor="effects-controls">
            Effects Controls
          </label>
          <Switch id="effects-controls" />
        </div>
        <div className={clsx(ToolbarPluginCSS.className, 'toggle-control')}>
          <label className={clsx(ToolbarPluginCSS.className, 'toggle-control-label')} htmlFor="blur-controls">
            Blur Controls
          </label>
          <Switch id="blur-controls" />
        </div>
        <div className={clsx(ToolbarPluginCSS.className, 'toggle-control')}>
          <label className={clsx(ToolbarPluginCSS.className, 'toggle-control-label')} htmlFor="drawing-controls">
            Drawing Controls
          </label>
          <Switch id="drawing-controls" />
        </div>
      </div>
    </Fragment>
  );
});

export { ToolbarPlugin };
