import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';

export const Route = createRootRoute({
  component: () => {
    return (
      <section className="h-full w-full flex bg-card-background">
        <Outlet />
        <Toaster richColors />
      </section>
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
