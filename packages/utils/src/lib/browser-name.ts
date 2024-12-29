export type BrowserName = 'firefox' | 'edge' | 'chrome' | 'unknown';

export function checkBrowserName(): BrowserName {
  const userAgent = navigator.userAgent;
  let browser: BrowserName;

  if (userAgent.indexOf('Firefox') > -1) {
    browser = 'firefox';
  } else if (userAgent.indexOf('Edge') > -1) {
    browser = 'edge';
  } else if (userAgent.indexOf('Chrome') > -1) {
    browser = 'chrome';
  } else {
    browser = 'unknown';
  }

  return browser;
}
