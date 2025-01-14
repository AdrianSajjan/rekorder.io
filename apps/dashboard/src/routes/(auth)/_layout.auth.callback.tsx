import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CheckCircle, Spinner, XCircle } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

import { supabase } from '@rekorder.io/database';
import { wait } from '@rekorder.io/utils';
import { animate, theme } from '@rekorder.io/ui';

import { useAuthenticationStore } from '../../store/authentication';

export const Route = createFileRoute('/(auth)/_layout/auth/callback')({
  component: AuthenticationCallback,
});

interface AuthenticationStatus {
  value: 'pending' | 'success' | 'error';
  message: string;
}

const WAIT_TIME = 1500;

function AuthenticationCallback() {
  const navigate = useNavigate();
  const authentication = useAuthenticationStore();

  const [status, setStatus] = useState<AuthenticationStatus>({
    value: 'pending',
    message: 'Your session is being authenticated...',
  });

  useEffect(() => {
    const promise = [supabase.auth.getUser(), supabase.auth.getSession(), wait(WAIT_TIME)] as const;
    Promise.all(promise).then(([user, session]) => {
      if (user.error || session.error || !session.data.session) {
        setStatus({ value: 'error', message: user.error?.message || session.error?.message || 'An unknown error occurred while authenticating your session' });
        authentication.logout();
        wait(WAIT_TIME).then(() => navigate({ to: '/login' }));
      } else {
        setStatus({ value: 'success', message: 'You have been logged in, redirecting to dashboard...' });
        authentication.login(user.data.user, session.data.session);
        wait(WAIT_TIME).then(() => navigate({ to: '/dashboard' }));
      }
    });
  }, [authentication, navigate]);

  switch (status.value) {
    case 'pending':
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
          <Spinner size={32} weight="bold" style={{ animation: animate.spin }} color={theme.colors.primary.main} />
          <p className="text-sm text-card-text font-medium mt-2">{status.message}</p>
        </div>
      );

    case 'success':
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
          <CheckCircle size={32} weight="fill" color={theme.colors.success.main} />
          <p className="text-sm text-success-main mt-2">{status.message}</p>
        </div>
      );

    case 'error':
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
          <XCircle size={32} weight="fill" color={theme.colors.destructive.main} />
          <p className="text-sm text-destructive-main mt-2">{status.message}</p>
        </div>
      );
  }
}
