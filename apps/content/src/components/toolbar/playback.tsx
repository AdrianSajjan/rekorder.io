import clsx from 'clsx';
import css from 'styled-jsx/css';

import { observer } from 'mobx-react';
import { theme } from '@rekorder.io/ui';
import { Fragment } from 'react/jsx-runtime';
import { Pause, Play, Record, Trash } from '@phosphor-icons/react';

import { recorder } from '../../store/recorder';
import { ToolbarAction } from '../ui/toolbar-action';

const disabled = ['idle', 'saving', 'countdown', 'pending', 'error'];

const RecordControlCSS = css.resolve`
  .timer {
    height: 100%;
    display: flex;
    align-items: center;

    margin: 0 ${theme.space(0.5)};
    padding: ${theme.space(0.5)} ${theme.space(3)};

    gap: ${theme.space(2)};
    border-radius: ${theme.space(10)};
    background-color: ${theme.alpha(theme.colors.text.muted, 0.1)};
  }

  .time {
    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: ${theme.colors.accent.main};
  }
`;

const ToolbarRecordingControls = observer((props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Fragment>
      {RecordControlCSS.styles}
      <div {...props}>
        <ToolbarAction tooltip="Save recording" disabled={disabled.includes(recorder.status)}>
          <Record size={16} weight="fill" onClick={recorder.saveScreenCapture} />
        </ToolbarAction>
        <div className={clsx(RecordControlCSS.className, 'timer')}>
          <span className={clsx(RecordControlCSS.className, 'time')}>{recorder.time}</span>
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
