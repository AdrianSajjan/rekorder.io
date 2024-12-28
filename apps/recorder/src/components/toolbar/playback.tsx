import { observer } from 'mobx-react';
import { Pause, Play } from '@phosphor-icons/react';

import { recorder } from '../../store/recorder';
import { ToolbarAction } from '../ui/toolbar-action';

const ToolbarRecorderPlayback = observer(() => {
  return recorder.status === 'active' ? (
    <ToolbarAction tooltip="Pause recording" onClick={recorder.pauseScreenCapture}>
      <Pause size={18} weight="fill" />
    </ToolbarAction>
  ) : (
    <ToolbarAction tooltip="Resume recording" onClick={recorder.resumeScreenCapture}>
      <Play size={18} weight="fill" />
    </ToolbarAction>
  );
});

export { ToolbarRecorderPlayback };
