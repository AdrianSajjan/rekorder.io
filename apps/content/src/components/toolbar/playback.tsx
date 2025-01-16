import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { ResolvedStyle, theme } from '@rekorder.io/ui';
import { Fragment } from 'react/jsx-runtime';
import { Pause, Play, Trash } from '@phosphor-icons/react';

import { recorder } from '../../store/recorder';
import { ToolbarAction } from '../ui/toolbar-action';

const disabled = ['idle', 'saving', 'countdown', 'pending', 'error'];

const RecordControlCSS = css.resolve`
  .rekorder-timer-container {
    height: 100%;
    display: flex;
    align-items: center;

    border-radius: ${theme.space(10)};
    padding: ${theme.space(0.5)} ${theme.space(3)};
    background-color: ${theme.alpha(theme.colors.text.muted, 0.1)};
  }

  .rekorder-timer-time {
    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: ${theme.colors.accent.main};
  }

  .rekorder-save-icon {
    width: ${theme.space(3.5)};
    height: ${theme.space(3.5)};
    border-radius: ${theme.space(1)};
    background-color: ${theme.colors.text.muted};
  }

  .rekorder-save-icon[data-status='active'],
  .rekorder-save-icon[data-status='paused'] {
    background-color: ${theme.colors.destructive.main};
  }
`;

const ToolbarRecordingControls = observer((props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Fragment>
      <ResolvedStyle>{RecordControlCSS}</ResolvedStyle>
      <div {...props}>
        <ToolbarAction tooltip="Save recording" onClick={recorder.saveScreenCapture} disabled={disabled.includes(recorder.status)}>
          <div data-status={recorder.status} className={clsx(RecordControlCSS.className, 'rekorder-save-icon')} />
        </ToolbarAction>
        <div className={clsx(RecordControlCSS.className, 'rekorder-timer-container')}>
          <span className={clsx(RecordControlCSS.className, 'rekorder-timer-time')}>{recorder.time}</span>
        </div>
        <ToolbarRecorderPlayPause />
        <ToolbarAction tooltip="Discard recording" disabled={disabled.includes(recorder.status)}>
          <Trash size={16} weight="bold" />
        </ToolbarAction>
      </div>
    </Fragment>
  );
});

const ToolbarRecorderPlayPause = observer(() => {
  return recorder.status === 'active' ? (
    <ToolbarAction tooltip="Pause recording" onClick={recorder.pauseScreenCapture} disabled={disabled.includes(recorder.status)}>
      <Pause size={16} weight="fill" />
    </ToolbarAction>
  ) : (
    <ToolbarAction tooltip="Resume recording" onClick={recorder.resumeScreenCapture} disabled={disabled.includes(recorder.status)}>
      <Play size={16} weight="fill" />
    </ToolbarAction>
  );
});

export { ToolbarRecordingControls };
