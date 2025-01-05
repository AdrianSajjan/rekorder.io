import './styles/globals.css';

import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { App } from './app';

const element = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(element);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
