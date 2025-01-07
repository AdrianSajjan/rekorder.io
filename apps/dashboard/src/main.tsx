import './styles/globals.css';

import * as ReactDOM from 'react-dom/client';

import { StrictMode } from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { AnimationsProvider } from '@rekorder.io/ui';

import { routeTree } from './routes.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const element = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(element);

root.render(
  <StrictMode>
    <AnimationsProvider>
      <RouterProvider router={router} />
    </AnimationsProvider>
  </StrictMode>
);
