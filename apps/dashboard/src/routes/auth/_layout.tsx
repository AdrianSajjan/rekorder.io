import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { Spinner, Brand, theme } from '@rekorder.io/ui';

import { useAuthenticationStore } from '../../store/authentication';
import PluginContentImage from '../../assets/images/authentication/content.png';
import PluginToolbarImage from '../../assets/images/authentication/toolbar.png';

export const Route = createFileRoute('/auth/_layout')({
  component: AuthenticationLayout,
});

function AuthenticationLayout() {
  const authentication = useAuthenticationStore();

  switch (authentication.status) {
    case 'unauthenticated':
      return (
        <main className="w-full grid grid-cols-12">
          <div className="col-span-6 relative">
            <Outlet />
          </div>
          <div className="p-4 col-span-6 h-screen sticky top-0">
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-b to-[#654ea3] from-[#eaafc8] flex flex-col items-center justify-between px-8 pt-8 pb-10">
              <Brand mode="expanded" height={36} className="" />
              <div className="flex flex-col items-center gap-4">
                <img className="h-80 w-auto rounded-xl overflow-hidden border border-borders-input/10 shadow-sm" src={PluginContentImage} alt="" />
                <img className="h-8 w-auto rounded overflow-hidden border border-borders-input/10 shadow-sm" src={PluginToolbarImage} alt="" />
              </div>
              <div className="flex items-end gap-8">
                <div className="flex flex-col gap-2.5">
                  <span className="text-[0.625rem] font-semibold text-white px-3 py-1 rounded-full bg-background-light/20 backdrop-blur-sm w-fit">Pro Tip</span>
                  <p className="text-xl font-medium text-white">Record your screen, annotate, and share your work with your team.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="h-12 w-12 border border-white/40 rounded-full flex items-center justify-center">
                    <CaretLeft weight="bold" size={20} color="#ffffff" />
                  </button>
                  <button className="h-12 w-12 border border-white/40 rounded-full flex items-center justify-center">
                    <CaretRight weight="bold" size={20} color="#ffffff" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      );

    case 'authenticated':
      return (
        <main className="h-screen w-screen flex items-center justify-center p-8">
          <Spinner size={32} color={theme.colors.primary.main} />
          <p className="text-sm text-card-text font-medium mt-2">Initializing your dashboard...</p>
          <Navigate to="/dashboard/library" />
        </main>
      );
  }
}
