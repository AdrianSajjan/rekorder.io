import { useEffect } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { CheckCircle } from '@phosphor-icons/react';

import { wait } from '@rekorder.io/utils';
import { EventConfig, ExtensionConfig, theme } from '@rekorder.io/constants';

import { useAuthenticationStore } from '../../store/authentication';

export const Route = createFileRoute('/extension/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  const { status, session } = useAuthenticationStore();

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;
    wait(1500).then(() => {
      window.chrome.runtime.sendMessage(ExtensionConfig.ExtensionId, {
        type: EventConfig.AuthenticateSuccess,
        payload: session,
      });
    });
  }, [status, session]);

  switch (status) {
    case 'authenticated':
      return (
        <main className="w-screen h-screen flex flex-col items-center justify-center gap-3">
          <CheckCircle size={32} weight="fill" color={theme.colors.success.main} />
          <p className="text-sm text-card-text font-medium">Your session has been authenticated, this tab will close automatically...</p>
        </main>
      );

    case 'unauthenticated':
      return <Outlet />;
  }
}
