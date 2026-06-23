import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Account, TimelineEntry } from '../types';

interface DataStore {
  accounts: Account[];
  timelineEntries: TimelineEntry[];
  addAccount: (data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAccount: (id: string, patch: Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteAccount: (id: string) => void;
  addEntry: (data: Omit<TimelineEntry, 'id' | 'createdAt'>) => void;
  updateEntry: (id: string, patch: Partial<Pick<TimelineEntry, 'entryDate' | 'title' | 'notes'>>) => void;
  deleteEntry: (id: string) => void;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      accounts: [],
      timelineEntries: [],

      addAccount: (data) =>
        set((s) => ({
          accounts: [
            ...s.accounts,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateAccount: (id, patch) =>
        set((s) => ({
          accounts: s.accounts.map((a) =>
            a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
          ),
        })),

      deleteAccount: (id) =>
        set((s) => ({
          accounts: s.accounts.filter((a) => a.id !== id),
          timelineEntries: s.timelineEntries.filter((e) => e.accountId !== id),
        })),

      addEntry: (data) =>
        set((s) => ({
          timelineEntries: [
            ...s.timelineEntries,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateEntry: (id, patch) =>
        set((s) => ({
          timelineEntries: s.timelineEntries.map((e) =>
            e.id === id ? { ...e, ...patch } : e
          ),
        })),

      deleteEntry: (id) =>
        set((s) => ({
          timelineEntries: s.timelineEntries.filter((e) => e.id !== id),
        })),
    }),
    { name: 'bu-tracker-data' }
  )
);
