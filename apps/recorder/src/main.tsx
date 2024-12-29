import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Recorder } from './recorder';

const node = document.getElementById('rekorder-ui');
if (node) node.parentNode?.removeChild(node);

const root = document.createElement('div');
root.id = 'rekorder-ui';
document.body.appendChild(root);

createRoot(root).render(
  <StrictMode>
    <Recorder />
  </StrictMode>
);
