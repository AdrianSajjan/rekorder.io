import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { checkBrowserName } from '@rekorder.io/utils';

class Thread {
  tab?: number;
  enabled?: boolean;
  injected: Set<number>;
  offscreen?: Promise<void>;

  handleTabReloadListener = this.__handleTabReloadListener.bind(this);
  handleTabChangeListener = this.__handleTabChangeListener.bind(this);
  handleActionClickListener = this.__handleActionClickListener.bind(this);
  handleRuntimeMessageListener = this.__handleRuntimeMessageListener.bind(this);

  static createInstance() {
    return new Thread();
  }

  constructor() {
    this.injected = new Set();
  }

  private async __handleSetupOffscreenDocument(path: string) {
    const url = chrome.runtime.getURL(path);
    const contents = await chrome.runtime.getContexts({ contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT], documentUrls: [url] });

    if (contents.length > 0) return;

    if (this.offscreen) {
      await this.offscreen;
    } else {
      this.offscreen = chrome.offscreen.createDocument({
        url: path,
        reasons: [chrome.offscreen.Reason.USER_MEDIA, chrome.offscreen.Reason.DISPLAY_MEDIA, chrome.offscreen.Reason.AUDIO_PLAYBACK],
        justification: 'Record users desktop screen and audio and microphone audio',
      });
      await this.offscreen;
      this.offscreen = undefined;
    }
  }

  private __injectContentScript() {
    if (this.tab) {
      chrome.scripting.executeScript(
        {
          target: { tabId: this.tab },
          files: ['build/content-script.js'],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.warn('Failed to inject content script:', chrome.runtime.lastError.message);
          } else {
            console.log('Content script injected into tab:', this.tab);
          }
        }
      );
    }
  }

  private __handleActionClickListener(tab: chrome.tabs.Tab) {
    if (tab.id) {
      this.tab = tab.id;
      this.enabled = true;
      this.injected.add(tab.id);
      this.__injectContentScript();
    }
  }

  private __handleTabReloadListener(details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) {
    if (details.tabId !== this.tab || !this.enabled) return;
    this.__injectContentScript();
  }

  private __handleTabChangeListener(tab: number, change: chrome.tabs.TabChangeInfo, data: chrome.tabs.Tab) {
    if (this.tab === tab || change.status !== 'complete' || data.url?.includes('chrome-extension://') || !this.enabled) return;
    this.tab = tab;
    this.injected.add(tab);
    this.__injectContentScript();
  }

  private __handleRuntimeMessageListener(message: RuntimeMessage, sender: chrome.runtime.MessageSender, respond: (response: RuntimeMessage) => void) {
    switch (message.type) {
      /**
       * Get the media stream id for the current tab and start capturing the stream in the offscreen document
       */
      case EventConfig.StartStreamCapture: {
        chrome.tabCapture.getMediaStreamId({ targetTabId: sender.tab?.id }, async (streamId) => {
          try {
            await this.__handleSetupOffscreenDocument('build/offscreen.html');
            chrome.runtime.sendMessage({ type: EventConfig.StartStreamCapture, payload: Object.assign({ streamId }, message.payload) });
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
       * Set the session storage, can be requested by the content script or the offscreen document
       */
      case EventConfig.SetSessionStorage: {
        chrome.storage.session.set(message.payload, () => {
          if (chrome.runtime.lastError) {
            respond({ type: EventConfig.SetSessionStorageError, payload: { error: chrome.runtime.lastError } });
          } else {
            respond({ type: EventConfig.SetSessionStorageSuccess, payload: message.payload });
          }
        });
        return true;
      }

      /**
       * Get the session storage, can be requested by the content script or the offscreen document
       */
      case EventConfig.GetSessionStorage: {
        chrome.storage.session.get(message.payload, (result) => {
          if (chrome.runtime.lastError) {
            respond({ type: EventConfig.GetSessionStorageError, payload: { error: chrome.runtime.lastError } });
          } else {
            respond({ type: EventConfig.GetSessionStorageSuccess, payload: result });
          }
        });
        return true;
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
        console.log('Unhandled message type:', message.type);
        return false;
      }
    }
  }
}

const thread = Thread.createInstance();

export { thread, Thread };
