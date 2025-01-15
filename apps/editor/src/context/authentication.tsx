import { Spinner } from '@phosphor-icons/react';
import { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

import { StorageConfig, theme } from '@rekorder.io/constants';
import { supabase } from '@rekorder.io/database';
import { animate } from '@rekorder.io/ui';

interface IAuthenticationContext {
  session: Session | null;
  status: 'authenticated' | 'unauthenticated';
}

export const AuthenticationContext = createContext<IAuthenticationContext | null>(null);

export function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'authenticated' | 'unauthenticated' | 'pending'>('pending');

  useEffect(() => {
    try {
      chrome.storage.local.get(StorageConfig.Authentication, (result) => {
        const session = result[StorageConfig.Authentication] as Session | null;
        if (!session) throw new Error('Unable to retrieve authenticated session');
        supabase.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
      });
    } catch {
      setStatus('unauthenticated');
      setSession(null);
    }

    const listener = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        setStatus('authenticated');
        setSession(session);
      } else {
        setStatus('unauthenticated');
        setSession(null);
      }
    });

    return () => {
      listener.data.subscription.unsubscribe();
    };
  }, []);

  switch (status) {
    case 'pending':
      return (
        <main className="h-screen w-screen bg-card-background flex items-center justify-center">
          <Spinner size={32} weight="bold" style={{ animation: animate.spin }} color={theme.colors.primary.main} />
        </main>
      );

    default:
      return <AuthenticationContext.Provider value={{ session, status }}>{children}</AuthenticationContext.Provider>;
  }
}

export function useAuthenticationContext() {
  const context = useContext(AuthenticationContext);
  if (!context) throw new Error('Please wrap your component in an AuthenticationProvider');
  return context;
}

export function useAuthenticatedSession() {
  const { session } = useAuthenticationContext();
  if (!session) throw new Error('Unable to retrieve authenticated session');
  return session;
}
