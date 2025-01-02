import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { checkBrowserName } from '@rekorder.io/utils';
import { offscreen } from '../libs/offscreen';

export function handleRuntimeMessageListener(message: RuntimeMessage, sender: chrome.runtime.MessageSender) {
  switch (message.type) {
    /**
     * Get the media stream id for the current tab and start capturing the stream in the offscreen document
     */
    case EventConfig.StartStreamCapture: {
      chrome.tabCapture.getMediaStreamId({ targetTabId: sender.tab?.id }, async (streamId) => {
        try {
          await offscreen.setup('build/offscreen.html');
          chrome.runtime.sendMessage({ type: EventConfig.StartStreamCapture, payload: { streamId } });
        } catch (error) {
          if (sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, { type: EventConfig.StartStreamCaptureError, payload: { error } });
          }
        }
      });
      return false;
    }

    /**
     * Successfully started capturing stream in the offscreen document, forward the message to the content script
     */
    case EventConfig.StartStreamCaptureSuccess: {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, message);
      });
      return false;
    }

    /**
     * Failed to start capturing stream in the offscreen document, forward the message to the content script
     */
    case EventConfig.StartStreamCaptureError: {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, message);
      });
      return false;
    }

    /**
     * Ask the offscreen document to save the captured stream from the content script
     */
    case EventConfig.SaveCapturedStream: {
      chrome.runtime.sendMessage(message);
      return false;
    }

    /**
     * Successfully saved the captured stream in the offscreen document, open the file in the browser
     */
    case EventConfig.SaveCapturedStreamSuccess: {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.tabs.create({ url: message.payload.url });
        if (tab.id) chrome.tabs.sendMessage(tab.id, message);
      });
      return false;
    }

    /**
     * Failed to save the captured stream in the offscreen document, forward the message to the content script
     */
    case EventConfig.SaveCapturedStreamError: {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, message);
      });
      return false;
    }

    /**
     * Ask the offscreen document to pause the captured stream from the content script
     */
    case EventConfig.PauseStreamCapture: {
      chrome.runtime.sendMessage(message);
      return false;
    }

    /**
     * Ask the offscreen document to resume the captured stream from the content script
     */
    case EventConfig.ResumeStreamCapture: {
      chrome.runtime.sendMessage(message);
      return false;
    }

    /**
     * Ask the offscreen document to cancel the captured stream from the content script
     */
    case EventConfig.DiscardStreamCapture: {
      chrome.runtime.sendMessage(message);
      return false;
    }

    /**
     * Message received from the content script relayed by background worker to toggle the push to talk activity
     */
    case EventConfig.ChangeAudioPushToTalkActivity: {
      chrome.runtime.sendMessage(message);
      return false;
    }

    /**
     * Message received from the content script relayed by background worker to toggle the audio muted state
     */
    case EventConfig.ChangeAudioMutedState: {
      chrome.runtime.sendMessage(message);
      return false;
    }

    /**
     * Open the permission settings page in the browser
     */
    case EventConfig.OpenPermissionSettings: {
      const name = checkBrowserName();
      if (name !== 'unknown') {
        const url = name + '://settings/content/siteDetails?site=chrome-extension://' + encodeURIComponent(chrome.runtime.id);
        chrome.tabs.create({ url });
      }
      return false;
    }

    default: {
      console.warn('Unhandled message type:', message.type);
      return false;
    }
  }
}
