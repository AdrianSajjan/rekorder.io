import { toast } from 'sonner';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

import { supabase } from '@rekorder.io/database';
import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';

export const SessionContext = createContext<User | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<User | null>(null);

  const handleRuntimeMessage = useCallback((message: RuntimeMessage) => {
    if (message.type === EventConfig.AuthenticateSuccess) {
      const session = message.payload as Session;
      supabase.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
    }
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSession(data.user);
    });
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          if (!session) return;
          setSession(session.user);
          toast.success('You have been authenticated successfully', { id: 'signed-in' });
          break;

        case 'SIGNED_OUT':
          setSession(null);
          toast.info('Your authenticated session has expired', { id: 'signed-out' });
          break;
      }
    });
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV) return;
    chrome.runtime.onMessage.addListener(handleRuntimeMessage);
    return () => chrome.runtime.onMessage.removeListener(handleRuntimeMessage);
  }, [handleRuntimeMessage]);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
