import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Content } from './content';
import { RECORDER_ROOT } from './constants/layout';

const node = document.getElementById(RECORDER_ROOT);
if (node) node.parentNode?.removeChild(node);

const root = document.createElement('div');
root.id = RECORDER_ROOT;
document.body.appendChild(root);

createRoot(root).render(
  <StrictMode>
    <Content />
  </StrictMode>
);
