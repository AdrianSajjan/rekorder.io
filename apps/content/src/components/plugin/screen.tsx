import clsx from 'clsx';
import css from 'styled-jsx/css';

import { RecorderSurface } from '@rekorder.io/types';
import { animations, Select, Switch, theme, Tooltip } from '@rekorder.io/ui';
import { observer } from 'mobx-react';

import { recorder } from '../../store/recorder';
import { RECORD_SURFACE_OPTIONS } from '../../constants/recorder';
import { SwitchLabel } from '../ui/switch-label';

const ScreenPluginCSS = css.resolve`
  .rekorder-screen-container {
    display: flex;
    flex-direction: column;
    gap: ${theme.space(5)};

    animation-name: ${animations['fade-in']};
    animation-duration: 300ms;
    animation-timing-function: ease-out;
  }

  .rekorder-toggle-control {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space(3)};
  }
`;

const ScreenPlugin = observer(() => {
  const handleSurfaceChange = (surface: string) => {
    recorder.changeDisplaySurface(surface as RecorderSurface);
  };

  return (
    <Tooltip.Provider>
      {ScreenPluginCSS.styles}
      <div className={clsx(ScreenPluginCSS.className, 'rekorder-screen-container')}>
        <Select value={recorder.surface} onValueChange={handleSurfaceChange}>
          <Select.Input />
          <Select.Content options={RECORD_SURFACE_OPTIONS} portal={document.getElementById('rekorder-area')} />
        </Select>
        {recorder.surface === 'tab' || recorder.surface === 'browser' ? (
          <div className={clsx('rekorder-toggle-control', ScreenPluginCSS.className)}>
            <SwitchLabel>Capture Device Audio</SwitchLabel>
            <Switch checked={recorder.audio} onCheckedChange={recorder.changeDesktopAudio} />
          </div>
        ) : null}
        <div className={clsx('rekorder-toggle-control', ScreenPluginCSS.className)}>
          <SwitchLabel>Zoom on Click</SwitchLabel>
          <Switch />
        </div>
      </div>
    </Tooltip.Provider>
  );
});

export { ScreenPlugin };
