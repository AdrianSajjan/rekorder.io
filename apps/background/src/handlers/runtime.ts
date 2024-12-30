import { RuntimeMessage } from '@rekorder.io/types';
import { checkBrowserName } from '@rekorder.io/utils';

export function handleRuntimeMessageListener(message: RuntimeMessage, sender: chrome.runtime.MessageSender, respond: (response: RuntimeMessage) => void) {
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

    case 'open.permissions.settings': {
      const name = checkBrowserName();
      if (name === 'unknown') return false;
      const url = name + '://settings/content/siteDetails?site=' + encodeURIComponent(sender.tab?.url || '');
      chrome.tabs.create({ url });
      return true;
    }

    default: {
      console.warn('Unhandled message type:', message.type);
      return false;
    }
  }
}
