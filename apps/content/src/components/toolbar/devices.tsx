import { observer } from 'mobx-react';
import { Microphone, VideoCamera, VideoCameraSlash, MicrophoneSlash } from '@phosphor-icons/react';

import { camera } from '../../store/camera';
import { ToolbarAction } from '../ui/toolbar-action';
import { microphone } from '../../store/microphone';

const ToolbarDeviceControls = observer((props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      <ToolbarAction disabled={camera.device === 'n/a'} onClick={() => camera.updateEnabled('toggle')} tooltip="Toggle video">
        {!camera.enabled || camera.device === 'n/a' ? <VideoCameraSlash size={16} weight="bold" /> : <VideoCamera size={16} weight="bold" />}
      </ToolbarAction>
      <ToolbarAction disabled={microphone.device === 'n/a'} onClick={() => microphone.updateEnabled('toggle')} tooltip="Toggle microphone">
        {!microphone.enabled || microphone.device === 'n/a' ? <MicrophoneSlash size={16} weight="bold" /> : <Microphone size={16} weight="bold" />}
      </ToolbarAction>
    </div>
  );
});

export { ToolbarDeviceControls };
