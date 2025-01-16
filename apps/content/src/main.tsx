import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Content } from './content';
import { RECORDER_ROOT } from './constants/layout';

if (!window.__rekorder__) {
  console.log('Injecting content script, initializing window.__rekorder__');

  window.__rekorder__ = true;
  const node = document.getElementById(RECORDER_ROOT);
  if (node) node.remove();

  const root = document.createElement('div');
  root.id = RECORDER_ROOT;
  document.body.appendChild(root);
  const shadow = root.attachShadow({ mode: 'open' });

  createRoot(shadow).render(
    <StrictMode>
      <Content />
    </StrictMode>
  );
} else {
  console.log('Skipping injection: Document already contains content script');
}

declare global {
  interface Window {
    __rekorder__: boolean;
  }
}
