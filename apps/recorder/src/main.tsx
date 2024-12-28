import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Recorder } from './recorder';

const exists = document.getElementById('rekorder-ui');
if (exists) document.removeChild(exists);

const root = document.createElement('div');
root.id = 'rekorder-ui';
document.body.appendChild(root);

createRoot(root).render(
  <StrictMode>
    <Recorder />
  </StrictMode>
);
