import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { checkBrowserName } from '@rekorder.io/utils';
import { offscreen } from '../libs/offscreen';

export function handleRuntimeMessageListener(message: RuntimeMessage, sender: chrome.runtime.MessageSender, respond: (response: RuntimeMessage) => void) {
  switch (message.type) {
    case EventConfig.TabCapture: {
      chrome.tabCapture.getMediaStreamId({ targetTabId: sender.tab?.id }, async (streamId) => {
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
        if (tab.id) chrome.tabs.sendMessage(tab.id, { ...message });
      });
      return false;
    }

    case EventConfig.StreamCaptureError: {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, { ...message });
      });
      return false;
    }

    case EventConfig.StreamSaveSuccess: {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.tabs.create({ url: message.payload.url });
        if (tab.id) chrome.tabs.sendMessage(tab.id, { ...message });
      });
      return false;
    }

    case EventConfig.StreamSaveError: {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, { ...message });
      });
      return false;
    }

    case EventConfig.StreamPauseCapture: {
      chrome.runtime.sendMessage({ ...message });
      return false;
    }

    case EventConfig.StreamResumeCapture: {
      chrome.runtime.sendMessage({ ...message });
      return false;
    }

    case EventConfig.StreamStopCapture: {
      chrome.runtime.sendMessage({ ...message });
      return false;
    }

    case EventConfig.OpenPermissionSettings: {
      const name = checkBrowserName();
      if (name === 'unknown') return false;
      const url = name + '://settings/content/siteDetails?site=' + encodeURIComponent(sender.tab?.url || '');
      chrome.tabs.create({ url });
      return false;
    }

    default: {
      console.warn('Unhandled message type:', message.type);
      return false;
    }
  }
}
