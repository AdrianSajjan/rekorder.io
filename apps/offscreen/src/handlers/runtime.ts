import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { recorder } from '../libs/recorder';

export function handleRuntimeMessageListener(message: RuntimeMessage) {
  switch (message.type) {
    case EventConfig.StreamStartCapture: {
      recorder.start(message.payload.streamId, message.payload.microphoneId);
      return true;
    }

    case EventConfig.StreamStopCapture: {
      recorder.stop();
      return true;
    }

    case EventConfig.StreamPauseCapture: {
      recorder.pause();
      return true;
    }

    case EventConfig.StreamResumeCapture: {
      recorder.resume();
      return true;
    }

    default: {
      console.warn('Unhandled message type:', message.type);
      return false;
    }
  }
}
