import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { checkBrowserName } from '@rekorder.io/utils';
import { offscreen } from '../libs/offscreen';

export function handleRuntimeMessageListener(message: RuntimeMessage, sender: chrome.runtime.MessageSender, respond: (response: RuntimeMessage) => void) {
  switch (message.type) {
    case EventConfig.TabCapture: {
      chrome.tabCapture.getMediaStreamId({ consumerTabId: sender.tab?.id }, async (streamId) => {
        try {
          await offscreen.setup('build/offscreen.html');
          respond({ type: EventConfig.TabCaptureSuccess, payload: { streamId } });
          chrome.runtime.sendMessage({ type: EventConfig.StreamStartCapture, payload: { streamId } });
        } catch (error) {
          respond({ type: EventConfig.TabCaptureError, payload: { error } });
        }
      });
      return true;
    }

    case EventConfig.StreamCaptureSuccess: {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, { type: EventConfig.StreamCaptureSuccess });
      });
      return true;
    }

    case EventConfig.StreamCaptureError: {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, { type: EventConfig.StreamCaptureError });
      });
      return true;
    }

    case EventConfig.StreamSaveSuccess: {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, { type: EventConfig.StreamSaveSuccess });
      });
      return true;
    }

    case EventConfig.StreamSaveError: {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, { type: EventConfig.StreamSaveError });
      });
      return true;
    }

    case EventConfig.OpenPermissionSettings: {
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
