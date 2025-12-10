import { create } from 'zustand'

type TabType = 'parametri' | 'calcule' | 'grafice' | 'formule' | 'document';

interface AppStore {
  // UI State
  activeTab: TabType;
  darkMode: boolean;
  sidebarCollapsed: boolean;

  // Python backend status
  backendConnected: boolean;
  backendError: string | null;

  // Actions
  setActiveTab: (tab: TabType) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setBackendStatus: (connected: boolean, error?: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeTab: 'parametri',
  darkMode: false,
  sidebarCollapsed: false,
  backendConnected: false,
  backendError: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.darkMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: newMode };
    }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setBackendStatus: (connected, error) =>
    set({ backendConnected: connected, backendError: error || null })
}))
