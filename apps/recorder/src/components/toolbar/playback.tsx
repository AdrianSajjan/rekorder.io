import { observer } from 'mobx-react';

import { ArrowCounterClockwise, Pause, Play, Record, Trash } from '@phosphor-icons/react';

import { recorder } from '../../store/recorder';
import { ToolbarAction } from '../ui/toolbar-action';

const ToolbarRecordingControls = observer((props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      <ToolbarAction tooltip="Download recording">
        <Record size={16} weight="fill" onClick={recorder.saveScreenCapture} />
      </ToolbarAction>
      <ToolbarRecorderPlayPause />
      <ToolbarAction tooltip="Restart recording">
        <ArrowCounterClockwise size={16} weight="bold" />
      </ToolbarAction>
      <ToolbarAction tooltip="Discard recording">
        <Trash size={16} weight="bold" />
      </ToolbarAction>
    </div>
  );
});

const ToolbarRecorderPlayPause = observer(() => {
  return recorder.status === 'active' ? (
    <ToolbarAction tooltip="Pause recording" onClick={recorder.pauseScreenCapture}>
      <Pause size={16} weight="fill" />
    </ToolbarAction>
  ) : (
    <ToolbarAction tooltip="Resume recording" onClick={recorder.resumeScreenCapture}>
      <Play size={16} weight="fill" />
    </ToolbarAction>
  );
});

export { ToolbarRecordingControls };
