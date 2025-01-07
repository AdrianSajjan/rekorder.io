import { Fragment } from 'react/jsx-runtime';
import { createFileRoute, Outlet } from '@tanstack/react-router';

import { Header } from '../../components/layout/header';
import { Sidebar } from '../../components/layout/sidebar';

export const Route = createFileRoute('/(app)/_layout')({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <Fragment>
      <Sidebar />
      <section className="flex flex-col flex-1 px-2.5">
        <Header />
        <main className="w-full pb-2.5">
          <Outlet />
        </main>
      </section>
    </Fragment>
  );
}
