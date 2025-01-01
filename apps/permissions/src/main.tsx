import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Permission } from './permission';

const root = ReactDOM.createRoot(document.getElementById('rekorder-permissions') as HTMLElement);

root.render(
  <StrictMode>
    <Permission />
  </StrictMode>
);
