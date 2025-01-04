import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { recorder } from '../libs/recorder';

export function handleRuntimeMessageListener(message: RuntimeMessage) {
  switch (message.type) {
    /**
     * Message received from the content script relayed by background worker to start capturing the tab stream
     * If stream id is present, the tab stream will be captured without prompting the user to select a display
     */
    case EventConfig.StartTabStreamCapture: {
      recorder.start(message.payload.streamId, message.payload.microphoneId, message.payload.captureDeviceAudio, message.payload.pushToTalk);
      return false;
    }

    /**
     * Message received from the content script relayed by background worker to start capturing the display stream
     * If streamId is empty, the user will be prompted to select a display to capture
     */
    case EventConfig.StartDisplayStreamCapture: {
      recorder.start('', message.payload.microphoneId, message.payload.captureDeviceAudio, message.payload.pushToTalk);
      return false;
    }

    /**
     * Message received from the content script relayed by background worker to save the captured stream
     */
    case EventConfig.SaveCapturedStream: {
      recorder.stop();
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
    case EventConfig.DiscardStreamCapture: {
      recorder.delete();
      return false;
    }

    case EventConfig.CancelStreamCapture: {
      recorder.cancel();
      return false;
    }

    /**
     * Message received from the content script relayed by background worker to toggle the microphone mute state
     */
    case EventConfig.ChangeAudioMutedState: {
      recorder.mute(message.payload.muted);
      return false;
    }

    /**
     * Message received from the content script relayed by background worker to toggle the push to talk activity
     */
    case EventConfig.ChangeAudioPushToTalkActivity: {
      recorder.mute(!message.payload.active);
      return false;
    }

    default: {
      console.log('Unhandled message type:', message.type);
      return false;
    }
  }
}
