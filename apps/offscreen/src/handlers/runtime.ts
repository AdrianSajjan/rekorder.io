import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { recorder } from '../libs/recorder';

export function handleRuntimeMessageListener(message: RuntimeMessage) {
  switch (message.type) {
    case EventConfig.StreamStartCapture: {
      console.log('Stream start capture', message.payload);
      recorder.start(message.payload.streamId, message.payload.microphoneId);
      return false;
    }

    case EventConfig.StreamStopCapture: {
      console.log('Stream stop capture', message.payload);
      recorder.stop(message.payload.timestamp);
      return false;
    }

    case EventConfig.StreamPauseCapture: {
      console.log('Stream pause capture', message.payload);
      recorder.pause();
      return false;
    }

    case EventConfig.StreamResumeCapture: {
      console.log('Stream resume capture', message.payload);
      recorder.resume();
      return false;
    }

    default: {
      console.warn('Unhandled message type:', message.type);
      return false;
    }
  }
}
