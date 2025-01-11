import './styles/globals.css';

import * as ReactDOM from 'react-dom/client';

import { StrictMode } from 'react';
import { AuthenticationPage } from './authentication';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <AuthenticationPage />
  </StrictMode>
);
