import { handleRuntimeMessageListener } from './handlers/runtime';

chrome.runtime.onMessage.addListener(handleRuntimeMessageListener);
