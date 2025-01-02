import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { recorder } from '../libs/recorder';

export function handleRuntimeMessageListener(message: RuntimeMessage) {
  switch (message.type) {
    /**
     * Message received from the content script relayed by background worker to start capturing the stream
     */
    case EventConfig.StartStreamCapture: {
      recorder.start(message.payload.streamId, message.payload.microphoneId);
      return false;
    }

    /**
     * Message received from the content script relayed by background worker to save the captured stream
     */
    case EventConfig.SaveCapturedStream: {
      recorder.stop(message.payload.timestamp);
      return false;
    }

    /**
     * Message received from the content script relayed by background worker to pause the captured stream
     */
    case EventConfig.PauseStreamCapture: {
      recorder.pause();
      return false;
    }

    /**
     * Message received from the content script relayed by background worker to resume the captured stream
     */
    case EventConfig.ResumeStreamCapture: {
      recorder.resume();
      return false;
    }

    /**
     * Message received from the content script relayed by background worker to cancel the captured stream
     */
    case EventConfig.CancelStreamCapture: {
      // TODO: Implement this
      return false;
    }

    default: {
      console.warn('Unhandled message type:', message.type);
      return false;
    }
  }
}
