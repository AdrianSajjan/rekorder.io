import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';

import { Header } from '../../components/layout/header';
import { Sidebar } from '../../components/layout/sidebar';
import { useAuthenticationStore } from '../../store/authentication';

import { theme } from '@rekorder.io/ui';
import { Spinner } from '@phosphor-icons/react';
import { animate } from '@rekorder.io/ui';

export const Route = createFileRoute('/(app)/_layout')({
  component: DashboardLayout,
});

function DashboardLayout() {
  const authentication = useAuthenticationStore();

  switch (authentication.status) {
    case 'unauthenticated':
      return (
        <main className="h-screen w-screen flex items-center justify-center p-8">
          <Spinner size={32} weight="bold" style={{ animation: animate.spin }} color={theme.colors.primary.main} />
          <p className="text-sm text-card-text font-medium mt-2">Session expired, please login again...</p>
          <Navigate to="/login" />
        </main>
      );

    case 'authenticated':
      return (
        <section className="flex w-full h-full bg-card-background">
          <Sidebar />
          <section className="flex flex-col flex-1 pl-5 pr-6">
            <Header />
            <main className="w-full pb-2.5">
              <Outlet />
            </main>
          </section>
        </section>
      );
  }
}
