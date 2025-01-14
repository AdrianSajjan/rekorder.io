import './styles/globals.css';

import * as ReactDOM from 'react-dom/client';

import { StrictMode } from 'react';
import { ThemeProvider } from '@rekorder.io/ui';

import { OfflineEditor } from './components/editor';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <RootApplication />
  </StrictMode>
);

function RootApplication() {
  return (
    <ThemeProvider>
      <OfflineEditor />
    </ThemeProvider>
  );
}
