import { RECORDER_ROOT } from "../constants/layout";

export function measureElement(element?: HTMLElement | null, initial?: Pick<DOMRect, 'width' | 'height'>): Pick<DOMRect, 'width' | 'height'> {
  if (!element) return { width: initial?.width || 0, height: initial?.height || 0 };
  const rect = element.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

export function openPermissionSettings() {
  chrome.runtime.sendMessage({ type: 'open.permissions.settings' });
}

export function shadowRootElementById(id: string) {
  const root = document.getElementById(RECORDER_ROOT);
  if (!root || !root.shadowRoot) return null;
  return root.shadowRoot.getElementById(id);
}

export function framerMotionParentDOM() {
  const root= document.getElementById(RECORDER_ROOT);
  if(!root||!root.shadowRoot) return document.head;
  return root.shadowRoot;
}

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}