import { observer } from 'mobx-react';
import { Pause, Play, Record, Trash } from '@phosphor-icons/react';

import { recorder } from '../../store/recorder';
import { ToolbarAction } from '../ui/toolbar-action';

const disabled = ['idle', 'saving', 'countdown', 'pending', 'error'];

const ToolbarRecordingControls = observer((props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      <ToolbarAction tooltip="Download recording" disabled={disabled.includes(recorder.status)}>
        <Record size={16} weight="fill" onClick={recorder.saveScreenCapture} />
      </ToolbarAction>
      <ToolbarRecorderPlayPause />
      <ToolbarAction tooltip="Discard recording" disabled={disabled.includes(recorder.status)}>
        <Trash size={16} weight="bold" />
      </ToolbarAction>
    </div>
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
