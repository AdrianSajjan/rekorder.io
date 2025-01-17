import './styles/globals.css';

import * as ReactDOM from 'react-dom/client';

import { Toaster } from 'sonner';
import { StrictMode } from 'react';
import { observer } from 'mobx-react';

import { Spinner, ThemeProvider } from '@rekorder.io/ui';
import { QueryClientProvider } from '@tanstack/react-query';

import { editor } from './store/editor';
import { queryClient } from './config/api';

import { OfflineEditor } from './components/editor';
import { Authenticate } from './components/authenticate';
import { AuthenticationProvider, useAuthenticationContext } from './context/authentication';

const ApplicationEntry = observer(() => {
  const { status } = useAuthenticationContext();

  switch (editor.status) {
    case 'initialized': {
      switch (status) {
        case 'authenticated':
          return <OfflineEditor />;
        default:
          return <Authenticate />;
      }
    }
    case 'error': {
      return (
        <main className="fixed inset-0 grid items-center bg-card-background">
          <p className="text-sm font-semibold text-destructive-main">Oops! Something went wrong while initializing the editor</p>
        </main>
      );
    }
    default: {
      return (
        <main className="fixed inset-0 flex flex-col items-center bg-card-background justify-center text-primary-main">
          <Spinner size={32} />
          <p className="text-sm font-semibold mt-3 text-card-text">Initializing the editor...</p>
        </main>
      );
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider global>
        <AuthenticationProvider>
          <ApplicationEntry />
          <Toaster richColors />
        </AuthenticationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
