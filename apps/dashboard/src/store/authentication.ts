import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  logout: () => void;
  login: (user: User, session: Session) => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  login: (user, session) => set({ user, session, isAuthenticated: true }),
  logout: () => set({ user: null, session: null, isAuthenticated: false }),
}));
