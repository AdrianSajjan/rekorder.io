import clsx from 'clsx';
import css from 'styled-jsx/css';

import { RecorderSurface } from '@rekorder.io/types';
import { ResolvedStyle, Select, Switch, theme, Tooltip } from '@rekorder.io/ui';
import { observer } from 'mobx-react';

import { recorder } from '../../store/recorder';
import { SwitchLabel } from '../ui/switch-label';
import { shadowRootElementById } from '../../lib/utils';
import { RECORD_SURFACE_OPTIONS } from '../../constants/recorder';

const ScreenPluginCSS = css.resolve`
  .rekorder-screen-container {
    display: flex;
    flex-direction: column;
    gap: ${theme.space(5)};
  }

  .rekorder-select-input {
    width: 100%;
  }

  .rekorder-toggle-control {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const ScreenPlugin = observer(() => {
  const handleSurfaceChange = (surface: string) => {
    recorder.changeDisplaySurface(surface as RecorderSurface);
  };

  return (
    <Tooltip.Provider>
      <ResolvedStyle>{ScreenPluginCSS}</ResolvedStyle>
      <div className={clsx(ScreenPluginCSS.className, 'rekorder-screen-container')}>
        <Select value={recorder.surface} onValueChange={handleSurfaceChange}>
          <Select.Input className={clsx(ScreenPluginCSS.className, 'rekorder-select-input')} />
          <Select.Content options={RECORD_SURFACE_OPTIONS} portal={shadowRootElementById('rekorder-area')} />
        </Select>
        {recorder.surface === 'tab' || recorder.surface === 'browser' ? (
          <div className={clsx('rekorder-toggle-control', ScreenPluginCSS.className)}>
            <SwitchLabel>Capture Device Audio</SwitchLabel>
            <Switch checked={recorder.audio} onCheckedChange={recorder.changeDesktopAudio} />
          </div>
        ) : null}
      </div>
    </Tooltip.Provider>
  );
});

export { ScreenPlugin };
