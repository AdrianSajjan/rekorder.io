import { create } from 'zustand';

export type AuthenticationMode = 'login' | 'register';

export interface AuthenticationState {
  mode: AuthenticationMode;
  setMode: (mode: AuthenticationMode) => void;
}

export const useAuthenticationStore = create<AuthenticationState>((set) => ({
  mode: 'login',
  setMode: (mode) => set({ mode }),
}));
