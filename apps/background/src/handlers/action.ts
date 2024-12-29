export function handleActionClickListener(tab: chrome.tabs.Tab) {
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['build/content-script.js'],
    });
  }
}
