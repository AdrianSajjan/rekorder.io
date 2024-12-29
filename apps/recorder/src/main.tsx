import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Recorder } from './recorder';

const id = 'rekorder-ui';
const node = document.getElementById(id);
if (node) node.parentNode?.removeChild(node);

const root = document.createElement('div');
root.id = id;
document.body.appendChild(root);

createRoot(root).render(
  <StrictMode>
    <Recorder />
  </StrictMode>
);
