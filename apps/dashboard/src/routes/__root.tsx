import { Toaster } from 'sonner';
import { Fragment, useEffect, useState } from 'react';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import { supabase } from '@rekorder.io/database';
import { Spinner, theme } from '@rekorder.io/ui';

import { useAuthenticationStore } from '../store/authentication';
import { RouterContext } from '../types/common';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <Fragment>
        <OutletComponent />
        <Toaster richColors />
      </Fragment>
    );
  },
  notFoundComponent: () => {
    return (
      <section className="h-screen w-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">404</h1>
        <p className="text-lg">Page not found</p>
      </section>
    );
  },
});

function OutletComponent() {
  const [isPending, setPending] = useState(true);

  const { login, logout } = useAuthenticationStore();

  useEffect(() => {
    supabase.auth.getSession().then(
      ({ data }) => {
        setPending(false);
        if (data.session) login(data.session);
        else logout();
      },
      (error) => {
        setPending(false);
        console.warn(error);
      }
    );

    const listener = supabase.auth.onAuthStateChange((event, session) => {
      if (session) login(session);
      else logout();
    });

    return () => {
      listener.data.subscription.unsubscribe();
    };
  }, [login, logout]);

  if (isPending) {
    return (
      <main className="h-screen w-screen flex items-center justify-center p-8">
        <Spinner size={32} color={theme.colors.primary.main} />
      </main>
    );
  }

  return <Outlet />;
}
