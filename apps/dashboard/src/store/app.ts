import { create } from 'zustand';

type SidebarMode = 'expanded' | 'collapsed';

interface AppState {
  sidebarMode: SidebarMode;
  toggleSidebar: () => void;
  setSidebarMode: (mode: SidebarMode) => void;
}

const useAppStore = create<AppState>((set) => ({
  sidebarMode: 'expanded',
  setSidebarMode: (mode) => set({ sidebarMode: mode }),
  toggleSidebar: () => set((state) => ({ sidebarMode: state.sidebarMode === 'expanded' ? 'collapsed' : 'expanded' })),
}));

export { useAppStore, type SidebarMode };
