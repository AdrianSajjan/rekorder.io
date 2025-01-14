import './styles/globals.css';

import * as ReactDOM from 'react-dom/client';

import { StrictMode } from 'react';
import { ThemeProvider } from '@rekorder.io/ui';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import { routeTree } from './routes.gen';

const router = createRouter({ routeTree });

const element = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(element);

root.render(
  <StrictMode>
    <RootApplication />
  </StrictMode>
);

function RootApplication() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
