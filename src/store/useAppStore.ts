import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  currentEmail: string | null;
  selectedMember: string | null;
  statusFilter: string;
  searchQuery: string;
  setCurrentEmail: (email: string) => void;
  setSelectedMember: (name: string | null) => void;
  setStatusFilter: (status: string) => void;
  setSearchQuery: (q: string) => void;
  clearSession: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentEmail: null,
      selectedMember: null,
      statusFilter: 'all',
      searchQuery: '',
      setCurrentEmail: (email) => set({ currentEmail: email }),
      setSelectedMember: (name) => set({ selectedMember: name }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      clearSession: () => set({ currentEmail: null, selectedMember: null, statusFilter: 'all', searchQuery: '' }),
    }),
    { name: 'bu-tracker-session' }
  )
);
