import { thread } from './libs/thread';

chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
chrome.action.onClicked.addListener(thread.handleActionClickListener);
chrome.runtime.onMessage.addListener(thread.handleRuntimeMessageListener);
chrome.tabs.onUpdated.addListener(thread.handleTabChangeListener);
