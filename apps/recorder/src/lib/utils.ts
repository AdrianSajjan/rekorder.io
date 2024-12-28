export function measureElement(element?: HTMLElement, initial?: Pick<DOMRect, "width" | "height">): Pick<DOMRect, "width" | "height"> {
  if (!element) return { width: initial?.width || 0, height: initial?.height || 0 };
  const rect = element.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}
