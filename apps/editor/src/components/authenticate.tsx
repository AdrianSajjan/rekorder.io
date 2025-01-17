import { useCallback, useEffect } from 'react';
import { Lock } from '@phosphor-icons/react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@rekorder.io/database';

import { Button } from '@rekorder.io/ui';
import { EventConfig } from '@rekorder.io/constants';
import { RuntimeMessage } from '@rekorder.io/types';

import Illustration from '../assets/authentication/illustration.svg';

export function Authenticate() {
  const handleRuntimeMessage = useCallback((message: RuntimeMessage) => {
    if (message.type === EventConfig.AuthenticateSuccess) {
      const session = message.payload as Session;
      supabase.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
    }
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV) return;
    chrome.runtime.onMessage.addListener(handleRuntimeMessage);
    return () => chrome.runtime.onMessage.removeListener(handleRuntimeMessage);
  }, [handleRuntimeMessage]);

  const handleAuthenticateSession = () => {
    chrome.runtime.sendMessage({ type: EventConfig.AuthenticateEditor });
  };

  return (
    <main className="h-screen w-screen bg-card-background flex flex-col items-center justify-center p-10 gap-10">
      <img src={Illustration} alt="" className="w-96 h-auto" />
      <div className="max-w-md w-full text-center">
        <h3 className="text-lg font-semibold">Session expired</h3>
        <p className="text-sm text-accent-dark mt-1 mb-6">
          Your session has expired. Please authenticate your session by clicking the button below to access the editor.
        </p>
        <Button variant="fancy" className="w-full" onClick={handleAuthenticateSession}>
          <Lock weight="bold" size={16} />
          <span>Authenticate Session</span>
        </Button>
      </div>
    </main>
  );
}
