import { thread } from './libs/thread';

chrome.action.onClicked.addListener(thread.handleActionClickListener);
chrome.runtime.onMessage.addListener(thread.handleRuntimeMessageListener);
chrome.tabs.onUpdated.addListener(thread.handleTabChangeListener);
