import { createFileRoute, Outlet } from '@tanstack/react-router';
import { LayoutGroup } from 'framer-motion';

import Background from '../../assets/images/authentication/background-2.png';

export const Route = createFileRoute('/(auth)/_layout')({
  component: AuthenticationLayout,
});

function AuthenticationLayout() {
  return (
    <main className="w-screen h-screen grid grid-cols-11">
      <div className="col-span-5">
        <LayoutGroup>
          <Outlet />
        </LayoutGroup>
      </div>
      <div className="p-4 col-span-6 h-screen">
        <div className="w-full h-full rounded-3xl overflow-hidden">
          <img className="h-full w-full object-cover" src={Background} alt="" />
        </div>
      </div>
    </main>
  );
}
