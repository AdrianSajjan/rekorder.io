import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

type AuthenticationStatus = 'authenticated' | 'unauthenticated' ;

interface AuthenticationState {
  session: Session | null;
  status: AuthenticationStatus;
  logout: () => void;
  login: (session:    Session) => void;
}

export const useAuthenticationStore = create<AuthenticationState>((set) => ({
  session: null,
  status: 'unauthenticated',
  login: (session) => set({ session, status: 'authenticated' }),
  logout: () => set({ session: null, status: 'unauthenticated' }),
}));

export function useAuthenticatedSession() {
  const authentication = useAuthenticationStore();
  if (!authentication.session) throw new Error('Failed to retrieve session');
  return authentication.session;
}
