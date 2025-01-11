import './styles/globals.css';

import * as ReactDOM from 'react-dom/client';

import { AnimationsProvider } from '@rekorder.io/ui';
import { StrictMode } from 'react';
import { OfflineEditor } from './components/editor';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <RootApplication />
  </StrictMode>
);

function RootApplication() {
  return (
    <AnimationsProvider>
      <OfflineEditor />
    </AnimationsProvider>
  );
}
