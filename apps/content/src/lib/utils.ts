export function measureElement(element?: HTMLElement | null, initial?: Pick<DOMRect, 'width' | 'height'>): Pick<DOMRect, 'width' | 'height'> {
  if (!element) return { width: initial?.width || 0, height: initial?.height || 0 };
  const rect = element.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

export function openPermissionSettings() {
  chrome.runtime.sendMessage({ type: 'open.permissions.settings' });
}
