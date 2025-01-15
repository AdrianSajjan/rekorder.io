import './styles/globals.css';

import * as ReactDOM from 'react-dom/client';

import { Toaster } from 'sonner';
import { StrictMode } from 'react';
import { ThemeProvider } from '@rekorder.io/ui';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './config/api';
import { AuthenticationProvider, useAuthenticationContext } from './context/authentication';
import { OfflineEditor } from './components/editor';
import { Authenticate } from './components/authenticate';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthenticationProvider>
          <ApplicationEntry />
          <Toaster richColors />
        </AuthenticationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);

function ApplicationEntry() {
  const { status } = useAuthenticationContext();

  switch (status) {
    case 'unauthenticated':
      return <Authenticate />;

    case 'authenticated':
      return <OfflineEditor />;
  }
}
