import './styles/globals.css';

import * as ReactDOM from 'react-dom/client';

import { Toaster } from 'sonner';
import { StrictMode } from 'react';
import { observer } from 'mobx-react';

import { Spinner, theme, ThemeProvider } from '@rekorder.io/ui';
import { QueryClientProvider } from '@tanstack/react-query';

import { editor } from './store/editor';
import { queryClient } from './config/api';

import { OfflineEditor } from './components/editor';
import { Authenticate } from './components/authenticate';
import { AuthenticationProvider, useAuthenticationContext } from './context/authentication';
import { XCircle } from '@phosphor-icons/react';

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
        <main className="fixed inset-0 flex flex-col items-center justify-center bg-card-background">
          <XCircle size={32} className="text-destructive-main" />
          <p className="text-sm mt-3 font-semibold text-destructive-main max-w-sm text-center">Oops! Seems like your browser doesn't support the required features required to run the editor</p>
        </main>
      );
    }
    default: {
      return (
        <main className="fixed inset-0 flex flex-col items-center justify-center bg-card-background">
          <Spinner size={32} color={theme.colors.primary.main} />
          <p className="text-sm font-semibold mt-3 text-card-text max-w-sm text-center">Initializing the editor...</p>
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
