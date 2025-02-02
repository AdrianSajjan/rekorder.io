import './styles/globals.css';

import * as ReactDOM from 'react-dom/client';

import { Toaster } from 'sonner';
import { StrictMode } from 'react';
import { ThemeProvider } from '@rekorder.io/ui';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './config/api';
import { OfflineEditor } from './components/editor';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider global>
        <OfflineEditor />
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
