import clsx from 'clsx';
import css from 'styled-jsx/css';

import { RecorderSurface } from '@rekorder.io/types';
import { animations, Select, Switch, theme, Tooltip } from '@rekorder.io/ui';
import { observer } from 'mobx-react';

import { recorder } from '../../store/recorder';
import { RECORD_SURFACE_OPTIONS } from '../../constants/recorder';

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

  .rekorder-toggle-control-label {
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: ${theme.space(0.5)};
    color: ${theme.colors.background.text};
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
          <Select.Content>
            {RECORD_SURFACE_OPTIONS.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        {recorder.surface === 'tab' || recorder.surface === 'browser' ? (
          <div className={clsx('rekorder-toggle-control', ScreenPluginCSS.className)}>
            <label className={clsx(ScreenPluginCSS.className, 'rekorder-toggle-control-label')}>Capture Device Audio</label>
            <Switch checked={recorder.audio} onCheckedChange={recorder.changeDesktopAudio} />
          </div>
        ) : null}
        <div className={clsx('rekorder-toggle-control', ScreenPluginCSS.className)}>
          <label className={clsx(ScreenPluginCSS.className, 'rekorder-toggle-control-label')}>Zoom on Click</label>
          <Switch />
        </div>
      </div>
    </Tooltip.Provider>
  );
});

export { ScreenPlugin };
