import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';

type AuthenticationStatus = 'authenticated' | 'unauthenticated' | 'pending';

interface AuthenticationState {
  status: AuthenticationStatus;
  user: User | null;
  session: Session | null;
  logout: () => void;
  login: (user: User, session: Session) => void;
  
}

export const useAuthenticationStore = create<AuthenticationState>((set) => ({
  user: null,
  session: null,
  status: 'unauthenticated',
  login: (user, session) => set({ user, session, status: 'authenticated' }),
  logout: () => set({ user: null, session: null, status: 'unauthenticated' }),
}));
