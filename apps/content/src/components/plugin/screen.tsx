import css from 'styled-jsx/css';
import clsx from 'clsx';

import { observer } from 'mobx-react';
import { Info } from '@phosphor-icons/react';
import { animations, Switch, theme, Tooltip } from '@rekorder.io/ui';

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
    display: inline-flex;
    align-items: center;
    gap: ${theme.space(0.5)};
    color: ${theme.colors.background.text};
  }
`;

const ScreenPlugin = observer(() => {
  return (
    <Tooltip.Provider>
      {ScreenPluginCSS.styles}
      <div className={clsx(ScreenPluginCSS.className, 'rekorder-screen-container')}>
        <div className={clsx('toggle-control', ScreenPluginCSS.className)}>
          <label className={clsx(ScreenPluginCSS.className, 'toggle-control-label')}>
            <span>Capture Device Audio</span>&nbsp;
            <Tooltip content="If Silent Tab Capture is disabled, when the share display popup is open, select tabs and enable share tab audio from the bottom right corner of the popup. Only Tabs have the system audio capture capability. Window and Entire Screen do not have the system audio capture option.">
              <Info size={16} weight="fill" />
            </Tooltip>
          </label>
          <Switch checked={recorder.audio} onCheckedChange={recorder.changeDesktopAudio} />
        </div>
        <div className={clsx('toggle-control', ScreenPluginCSS.className)}>
          <label className={clsx(ScreenPluginCSS.className, 'toggle-control-label')}>
            <span>Silent Tab Capture</span>&nbsp;
            <Tooltip content="The Current Tab will be captured without any prompt or popup, the audio will be enabled based on the Capture Device Audio settings. This is useful cause it doesn't show the 'Sharing tab' banner on top of the page which reduces the page dimensions. However, if this option is selected, you won't be able to record a different tab in between recording.">
              <Info size={16} weight="fill" />
            </Tooltip>
          </label>
          <Switch />
        </div>
        <div className={clsx('toggle-control', ScreenPluginCSS.className)}>
          <label className={clsx(ScreenPluginCSS.className, 'toggle-control-label')}>Zoom on Click</label>
          <Switch disabled />
        </div>
      </div>
    </Tooltip.Provider>
  );
});

export { ScreenPlugin };
