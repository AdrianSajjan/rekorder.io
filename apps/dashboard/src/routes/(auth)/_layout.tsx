import { createFileRoute, Outlet } from '@tanstack/react-router';

import Background from '../../assets/images/authentication/background-2.png';
import { Brand } from '@rekorder.io/ui';

export const Route = createFileRoute('/(auth)/_layout')({
  component: AuthenticationLayout,
});

function AuthenticationLayout() {
  return (
    <main className="grid grid-cols-11">
      <div className="col-span-5 relative">
        <div className="absolute top-6 left-6">
          <Brand mode="expanded" height={36} className="" />
        </div>
        <Outlet />
      </div>
      <div className="p-4 col-span-6 h-screen sticky top-0">
        <div className="w-full h-full rounded-3xl overflow-hidden">
          <img className="h-full w-full object-cover" src={Background} alt="" />
        </div>
      </div>
    </main>
  );
}
