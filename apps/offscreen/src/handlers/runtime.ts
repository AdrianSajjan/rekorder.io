import { RuntimeMessage } from '@rekorder.io/types';

export function handleRuntimeMessageListener(message: RuntimeMessage, sender: chrome.runtime.MessageSender, respond: (response: RuntimeMessage) => void) {
  switch (message.type) {
    case 'capture.tab': {
      return true;
    }

    default: {
      console.warn('Unhandled message type:', message.type);
      return false;
    }
  }
}
