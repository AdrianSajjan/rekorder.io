import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { recorder } from '../libs/recorder';

export function handleRuntimeMessageListener(message: RuntimeMessage) {
  switch (message.type) {
    case EventConfig.StreamStartCapture: {
      recorder.start(message.payload.streamId, message.payload.microphoneId);
      return false;
    }

    case EventConfig.StreamStopCapture: {
      recorder.stop(message.payload.timestamp);
      return false;
    }

    case EventConfig.StreamPauseCapture: {
      recorder.pause();
      return false;
    }

    case EventConfig.StreamResumeCapture: {
      recorder.resume();
      return false;
    }

    default: {
      console.warn('Unhandled message type:', message.type);
      return false;
    }
  }
}
