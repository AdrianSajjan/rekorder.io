import { checkBrowserName } from './user-agent';

export function openPermissionSettings() {
  const browserName = checkBrowserName();
  if (browserName === 'unknown' || !chrome || !chrome.tabs) return;
  const url = browserName + '://settings/content/siteDetails?site=' + encodeURIComponent(window.location.href);
  chrome.tabs.create({ url });
}
