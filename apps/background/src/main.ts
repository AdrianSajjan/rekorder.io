import { RuntimeMessage } from '@rekorder.io/types';

function handleRuntimeMessage(
  message: RuntimeMessage,
  sender: chrome.runtime.MessageSender,
  respond: (response: RuntimeMessage) => void
) {
  switch (message.type) {
    case 'capture.tab': {
      try {
        chrome.tabCapture.getMediaStreamId({ targetTabId: sender.tab?.id }, (streamId) => {
          respond({ type: 'capture.tab.sucesss', payload: { streamId } });
        });
        return true;
      } catch (error) {
        respond({ type: 'capture.tab.error', payload: { error } });
        return false;
      }
    }

    default: {
      console.warn('Unhandled message type:', message.type);
      return false;
    }
  }
}

chrome.runtime.onMessage.addListener(handleRuntimeMessage);
