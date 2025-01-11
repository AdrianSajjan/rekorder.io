import './styles/globals.css';

import * as ReactDOM from 'react-dom/client';

import { StrictMode } from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { AnimationsProvider } from '@rekorder.io/ui';

import { routeTree } from './routes.gen';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <RootApplication />
  </StrictMode>
);

const router = createRouter({ routeTree, basepath: '/build/editor/' });

function RootApplication() {
  return (
    <AnimationsProvider>
      <RouterProvider router={router} />
    </AnimationsProvider>
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
