import { RuntimeMessage } from '@rekorder.io/types';

chrome.runtime.onMessage.addListener(
  (message: RuntimeMessage, sender: chrome.runtime.MessageSender, respond: (response: RuntimeMessage) => void) => {
    return true;
  }
);
