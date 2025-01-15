import './styles/globals.css';

import * as ReactDOM from 'react-dom/client';

import { ThemeProvider } from '@rekorder.io/ui';
import { StrictMode } from 'react';

import { OfflineEditor } from './components/editor';
import { AuthenticationProvider, useAuthenticationContext } from './context/authentication';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <ThemeProvider>
      <AuthenticationProvider>
        <ApplicationEntry />
      </AuthenticationProvider>
    </ThemeProvider>
  </StrictMode>
);

function ApplicationEntry() {
  const { status } = useAuthenticationContext();

  switch (status) {
    case 'unauthenticated':
      return <button>Login</button>;

    case 'authenticated':
      return <OfflineEditor />;
  }
}
