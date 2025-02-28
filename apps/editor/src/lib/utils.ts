import { EventConfig } from '@rekorder.io/constants';

export function fileDownloadBlob(blob: Blob, name: string, extension: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name + extension;
  a.click();
  URL.revokeObjectURL(url);
}

export function authenticateSession() {
  chrome.runtime.sendMessage({ type: EventConfig.AuthenticateEditor });
}
