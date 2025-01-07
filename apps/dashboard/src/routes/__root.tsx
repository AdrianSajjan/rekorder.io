import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { Sidebar } from '../components/layout/sidebar';
import { Header } from '../components/layout/header';

export const Route = createRootRoute({
  component: () => (
    <section className="h-full w-full flex bg-card-background">
      <Sidebar />
      <section className="flex flex-col flex-1 px-2.5">
        <Header />
        <main className="w-full pb-2.5">
          <Outlet />
        </main>
      </section>
      <TanStackRouterDevtools />
    </section>
  ),
});
