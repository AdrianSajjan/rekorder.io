import { EventConfig, StorageConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';
import { checkBrowserName } from '@rekorder.io/utils';
import type { Session } from '@supabase/supabase-js';

const OFFSCREEN_PATH = 'build/offscreen.html';
const AUTHENTICATION_URL = 'http://localhost:4200/extension/login';

class Thread {
  enabled: boolean;
  offscreenPromise: Promise<void> | null;
  editorResolvers: PromiseWithResolvers<void> | null;

  editorTab: chrome.tabs.Tab | null;
  currentTab: chrome.tabs.Tab | null;
  injectedTabs: Set<chrome.tabs.Tab>;
  originalTab: chrome.tabs.Tab | null;

  authenticationMode: 'script' | 'editor';
  authenticationTab: chrome.tabs.Tab | null;

  handleTabChangeListener = this.__handleTabChangeListener.bind(this);
  handleActionClickListener = this.__handleActionClickListener.bind(this);
  handleRuntimeMessageListener = this.__handleRuntimeMessageListener.bind(this);
  handleRuntimeExternalMessageListener = this.__handleRuntimeExternalMessageListener.bind(this);

  static createInstance() {
    return new Thread();
  }

  constructor() {
    this.enabled = false;
    this.editorResolvers = null;
    this.offscreenPromise = null;

    this.editorTab = null;
    this.currentTab = null;
    this.originalTab = null;
    this.injectedTabs = new Set();

    this.authenticationTab = null;
    this.authenticationMode = 'script';
  }

  private async __handleCloseExtension() {
    try {
      const exists = await chrome.offscreen.hasDocument();
      if (exists) chrome.offscreen.closeDocument(() => console.log('Offscreen document closed'));
    } catch (error) {
      console.warn('Error in background while closing offscreen document', error);
    }

    this.enabled = false;
    this.currentTab = null;
    this.originalTab = null;
    this.offscreenPromise = null;

    this.injectedTabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: EventConfig.CloseExtension });
        console.log('Sent close extension message to tab:', tab.id, tab.url, tab.title);
      }
    });
    this.injectedTabs.clear();
  }

  private async __handleSetupOffscreenDocument() {
    const exists = await chrome.offscreen.hasDocument();
    if (exists) return console.log('Offscreen document already exists, not creating a new one');

    if (this.offscreenPromise) {
      await this.offscreenPromise;
    } else {
      this.offscreenPromise = chrome.offscreen.createDocument({
        url: OFFSCREEN_PATH,
        reasons: [chrome.offscreen.Reason.USER_MEDIA, chrome.offscreen.Reason.DISPLAY_MEDIA, chrome.offscreen.Reason.AUDIO_PLAYBACK],
        justification: 'Record either tab stream or desktop screen and audio as well as microphone audio',
      });
      await this.offscreenPromise;
      this.offscreenPromise = null;
    }
  }

  private __preventContentInjection(tab: chrome.tabs.Tab) {
    return tab.url?.includes('chrome://') || tab.url?.includes('chrome-extension://');
  }

  private __injectContentScript() {
    if (!this.enabled || !this.currentTab || !this.currentTab.id || this.__preventContentInjection(this.currentTab)) return;

    const tab = this.currentTab;
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id! },
        files: ['build/content-script.js'],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.warn('Failed to inject content script:', tab.id, tab.url, tab.title, chrome.runtime.lastError.message);
        } else {
          console.log('Content script injected into tab:', tab.id, tab.url, tab.title);
        }
      }
    );
  }

  private __handleInitializeExtension(tab: chrome.tabs.Tab) {
    this.enabled = true;
    this.currentTab = tab;
    this.originalTab = tab;

    this.injectedTabs.add(tab);
    this.__injectContentScript();
  }

  /**
   * TODO: Finish up the authentication system
   */
  private async __handleAuthenticateUser(tab: chrome.tabs.Tab) {
    this.currentTab = tab;
    this.authenticationMode = 'script';
    this.authenticationTab = await chrome.tabs.create({ url: AUTHENTICATION_URL, active: true });
  }

  

  private __handleAuthenticationSuccess(message: RuntimeMessage) {
    switch (this.authenticationMode) {
      case 'script':
        if (this.currentTab) {
          chrome.tabs.highlight({ tabs: this.currentTab.index, windowId: this.currentTab.windowId }, () => {
            this.__handleInitializeExtension(this.currentTab!);
          });
        }
        break;

      case 'editor':
        if (this.editorTab) {
          chrome.tabs.highlight({ tabs: this.editorTab.index, windowId: this.editorTab.windowId }, () => {
            if (this.editorTab) chrome.tabs.sendMessage(this.editorTab.id!, message);
          });
        }
        break;
    }
  }

  private async __handleActionClickListener(tab: chrome.tabs.Tab) {
    const result = await chrome.storage.local.get(StorageConfig.Authentication);
    const authentication = result[StorageConfig.Authentication] as Session | null;

    if (!authentication) {
      this.__handleAuthenticateUser(tab);
    } else if (this.enabled) {
      this.__handleCloseExtension();
    } else if (this.__preventContentInjection(tab)) {
      console.log('Tab is in the extension, maybe handle this case');
    } else if (!tab.id) {
      console.log('Tab id is not present, will not happen, optionally handle this case');
    } else {
      this.__handleInitializeExtension(tab);
    }
  }

  private __handleTabChangeListener(tabId: number, change: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
    if (change.status === 'complete') {
      if (tabId === this.editorTab?.id) {
        this.editorResolvers?.resolve();
        this.editorResolvers = null;
      } else {
        if (this.enabled) {
          this.currentTab = tab;
          this.injectedTabs.add(tab);
          this.__injectContentScript();
        }
      }
    }
  }

  private __sendMessageToContentScript(message: RuntimeMessage, success?: () => void, error?: () => void) {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      const id = tab?.id || this.currentTab?.id;
      if (id) {
        chrome.tabs.sendMessage(id, message);
        success?.();
      } else {
        error?.();
        console.warn('No active tab found, message not sent', message);
      }
    });
  }

  private async __waitForEditorTabLoad(tab: chrome.tabs.Tab) {
    this.editorTab = tab;
    this.editorResolvers = Promise.withResolvers();
    await this.editorResolvers.promise;
  }

  private __handleRuntimeMessageListener(message: RuntimeMessage, sender: chrome.runtime.MessageSender, respond: (response: RuntimeMessage) => void) {
    switch (message.type) {
      /**
       * Close the extension
       */
      case EventConfig.CloseExtension: {
        this.__handleCloseExtension();
        return false;
      }

      /**
       * Get the media stream id for the current tab and start capturing the stream in the offscreen document, sent from the content script
       * Sender Tab ID is the tab that the content script is injected into
       */
      case EventConfig.StartTabStreamCapture: {
        chrome.tabCapture.getMediaStreamId({ targetTabId: sender.tab?.id }, async (streamId) => {
          if (chrome.runtime.lastError) {
            const error = chrome.runtime.lastError;
            if (sender.tab?.id) chrome.tabs.sendMessage(sender.tab.id, { type: EventConfig.StartStreamCaptureError, payload: { error } });
            console.warn('Error in background while getting media stream id', error);
          } else {
            try {
              await this.__handleSetupOffscreenDocument();
              chrome.runtime.sendMessage({ type: EventConfig.StartTabStreamCapture, payload: Object.assign({ streamId }, message.payload) });
            } catch (error) {
              if (sender.tab?.id) chrome.tabs.sendMessage(sender.tab.id, { type: EventConfig.StartStreamCaptureError, payload: { error } });
              console.warn('Error in background while starting tab stream capture', error);
            }
          }
        });
        return false;
      }

      /**
       * Start capturing the display stream in the offscreen document, this will show a dialog to the user to select the display to capture, sent from the content script
       * Sender Tab ID is the tab that the content script is injected into
       */
      case EventConfig.StartDisplayStreamCapture: {
        this.__handleSetupOffscreenDocument().then(
          () => {
            chrome.runtime.sendMessage({ type: EventConfig.StartDisplayStreamCapture, payload: message.payload });
            console.log('Offscreen document setup complete, starting display stream capture');
          },
          (error) => {
            if (sender.tab?.id) chrome.tabs.sendMessage(sender.tab.id, { type: EventConfig.StartStreamCaptureError, payload: { error } });
            console.warn('Error in background while setting up offscreen document', error);
          }
        );
        return false;
      }

      /**
       * Start recording the stream in the offscreen document, sent from the content script
       */
      case EventConfig.StartStreamRecording: {
        chrome.runtime.sendMessage(message);
        return false;
      }

      /**
       * Successfully started capturing stream in the offscreen document, forward the message to the content script
       */
      case EventConfig.StartStreamCaptureSuccess: {
        this.__sendMessageToContentScript(message);
        return false;
      }

      /**
       * Successfully started recording the stream in the offscreen document, forward the message to the content script
       */
      case EventConfig.StartStreamRecordingSuccess: {
        this.__sendMessageToContentScript(message);
        return false;
      }

      /**
       * Failed to start recording the stream in the offscreen document, forward the message to the content script
       */
      case EventConfig.StartStreamCaptureError: {
        this.__sendMessageToContentScript(message);
        return false;
      }

      /**
       * Successfully started recording the stream in the offscreen document, forward the message to the content script
       */
      case EventConfig.StartStreamRecordingError: {
        this.__sendMessageToContentScript(message);
        return false;
      }

      /**
       * Ask the offscreen document to save the captured stream, sent from the content script
       */
      case EventConfig.SaveCapturedStream: {
        chrome.runtime.sendMessage(message);
        return false;
      }

      /**
       * Successfully saved the captured stream in the offscreen document, close the extension and offscreen document and open the editor
       */
      case EventConfig.SaveCapturedStreamSuccess: {
        this.__handleCloseExtension().finally(() => {
          chrome.tabs.create({ url: chrome.runtime.getURL('build/editor.html') }, async (tab) => {
            if (tab.id) {
              console.log('Editor tab created, waiting for the tab to load');
              await this.__waitForEditorTabLoad(tab);
              console.log('Editor tab is loaded, sending message to initialize editor');
              chrome.tabs.sendMessage(tab.id, { type: EventConfig.InitializeEditor, payload: message.payload });
            } else {
              console.warn('Failed to create editor tab, id is not present', tab);
            }
          });
        });

        return false;
      }

      /**
       * Failed to save the captured stream in the offscreen document, forward the message to the content script, sent from the offscreen document
       */
      case EventConfig.SaveCapturedStreamError: {
        this.__sendMessageToContentScript(message);
        return false;
      }

      /**
       * Ask the offscreen document to pause the captured stream, sent from the content script
       */
      case EventConfig.PauseStreamCapture: {
        chrome.runtime.sendMessage(message);
        return false;
      }

      /**
       * Ask the offscreen document to resume the captured stream, sent from the content script
       */
      case EventConfig.ResumeStreamCapture: {
        chrome.runtime.sendMessage(message);
        return false;
      }

      /**
       * Ask the offscreen document to cancel the captured stream, sent from the content script
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

      /**
       * Authenticate the editor, sent from the content script
       */
      case EventConfig.AuthenticateEditor: {
        this.authenticationMode = 'editor';
        chrome.tabs.create({ url: AUTHENTICATION_URL, active: true }, (tab) => {
          this.authenticationTab = tab;
        });
        return false;
      }

      default: {
        console.log('Unhandled message type:', message.type);
        return false;
      }
    }
  }

  private __handleRuntimeExternalMessageListener(message: RuntimeMessage) {
    switch (message.type) {
      /**
       * Successfully authenticated user, set the session storage and close the authentication tab
       */
      case EventConfig.AuthenticateSuccess: {
        if (message.payload) {
          chrome.storage.local.set({ [StorageConfig.Authentication]: message.payload }, () => {
            console.log('User has been authenticated, closing authentication tab');
            if (!this.authenticationTab || !this.authenticationTab.id) {
              this.__handleAuthenticationSuccess(message);
            } else {
              chrome.tabs.remove(this.authenticationTab.id, () => {
                this.__handleAuthenticationSuccess(message);
              });
            }
          });
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
