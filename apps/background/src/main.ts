import { handleActionClickListener } from './handlers/action';
import { handleRuntimeMessageListener } from './handlers/runtime';

chrome.action.onClicked.addListener(handleActionClickListener);
chrome.runtime.onMessage.addListener(handleRuntimeMessageListener);
