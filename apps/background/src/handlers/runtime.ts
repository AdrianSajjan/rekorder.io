import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { checkBrowserName } from '@rekorder.io/utils';
import { offscreen } from '../libs/offscreen';

export function handleRuntimeMessageListener(message: RuntimeMessage, sender: chrome.runtime.MessageSender, respond: (response: RuntimeMessage) => void) {
  switch (message.type) {
    case EventConfig.TabCapture: {
      console.log('TabCapture');
      chrome.tabCapture.getMediaStreamId({ targetTabId: sender.tab?.id }, async (streamId) => {
        try {
          console.log('Setting up offscreen', streamId);
          await offscreen.setup('build/offscreen.html');
          console.log('Offscreen setup complete');
          respond({ type: EventConfig.TabCaptureSuccess, payload: { streamId } });
          console.log('Sending StreamStartCapture message');
          chrome.runtime.sendMessage({ type: EventConfig.StreamStartCapture, payload: { streamId } });
        } catch (error) {
          console.error('Error setting up offscreen', error);
          respond({ type: EventConfig.TabCaptureError, payload: { error } });
        }
      });
      return true;
    }

    case EventConfig.StreamCaptureSuccess: {
      console.log('Stream capture success', message.payload);
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, { ...message });
      });
      return false;
    }

    case EventConfig.StreamCaptureError: {
      console.log('Stream capture error', message.payload);
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, { ...message });
      });
      return false;
    }

    case EventConfig.StreamSaveSuccess: {
      console.log('Stream save success', message.payload);
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        console.log('Sending save success message to tab', tab.id);
        if (tab.id) chrome.tabs.sendMessage(tab.id, { ...message });
      });
      return false;
    }

    case EventConfig.StreamSaveError: {
      console.log('Stream save error', message.payload);
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        console.log('Sending save error message to tab', tab.id);
        if (tab.id) chrome.tabs.sendMessage(tab.id, { ...message });
      });
      return false;
    }

    case EventConfig.StreamPauseCapture: {
      console.log('Stream pause capture', message.payload);
      chrome.runtime.sendMessage({ ...message });
      return false;
    }

    case EventConfig.StreamResumeCapture: {
      console.log('Stream resume capture', message.payload);
      chrome.runtime.sendMessage({ ...message });
      return false;
    }

    case EventConfig.StreamStopCapture: {
      console.log('Stream stop capture', message.payload);
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
