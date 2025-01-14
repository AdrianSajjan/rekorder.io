import { CheckCircle, Spinner, XCircle } from '@phosphor-icons/react';
import { supabase } from '@rekorder.io/database';
import { animate, theme } from '@rekorder.io/ui';
import { wait } from '@rekorder.io/utils';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/(extension)/extension/auth/callback')({
  component: RouteComponent,
});

interface AuthenticationStatus {
  value: 'pending' | 'success' | 'error';
  message: string;
}

const WAIT_TIME = 1500;

function RouteComponent() {
  const [status, setStatus] = useState<AuthenticationStatus>({
    value: 'pending',
    message: 'Your session is being authenticated...',
  });

  useEffect(() => {
    const promise = [supabase.auth.getUser(), supabase.auth.getSession(), wait(WAIT_TIME)] as const;
    Promise.all(promise).then(([user, session]) => {
      if (user.error || session.error || !session.data.session) {
        setStatus({ value: 'error', message: user.error?.message || session.error?.message || 'An unknown error occurred while authenticating your session' });
      } else {
        setStatus({ value: 'success', message: 'You have been logged in, this tab will close automatically...' });
      }
    });
  }, []);

  switch (status.value) {
    case 'pending':
      return (
        <Layout>
          <Spinner size={32} weight="bold" style={{ animation: animate.spin }} color={theme.colors.primary.main} />
          <p className="text-sm font-medium w-fit">{status.message}</p>
        </Layout>
      );

    case 'success':
      return (
        <Layout>
          <CheckCircle size={32} weight="fill" color={theme.colors.success.main} />
          <p className="text-sm font-medium w-fit">{status.message}</p>
        </Layout>
      );

    case 'error':
      return (
        <Layout>
          <XCircle size={32} weight="fill" color={theme.colors.destructive.main} />
          <p className="text-sm font-medium w-fit">{status.message}</p>
        </Layout>
      );
  }
}

function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-10 bg-background-light overscroll-none">
      <div className="w-full max-w-md flex flex-col items-center bg-card-background px-10 py-10 rounded-2xl shadow-sm text-center gap-2.5">{children}</div>
    </div>
  );
}
