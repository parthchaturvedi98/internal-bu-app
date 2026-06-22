import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  selectedMember: string | null;
  statusFilter: string;
  searchQuery: string;
  setSelectedMember: (name: string | null) => void;
  setStatusFilter: (status: string) => void;
  setSearchQuery: (q: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedMember: null,
      statusFilter: 'all',
      searchQuery: '',
      setSelectedMember: (name) => set({ selectedMember: name }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setSearchQuery: (q) => set({ searchQuery: q }),
    }),
    { name: 'bu-tracker-session' }
  )
);
