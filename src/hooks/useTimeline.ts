import { useMemo } from 'react';
import { useDataStore } from '../store/useDataStore';
import type { TimelineEntry } from '../types';

type CreateInput = Omit<TimelineEntry, 'id' | 'createdAt'>;
type UpdateInput = { id: string; accountId: string } & Partial<Pick<TimelineEntry, 'entryDate' | 'title' | 'notes'>>;

export function useTimeline(accountId: string) {
  const timelineEntries = useDataStore((s) => s.timelineEntries);
  const data = useMemo(
    () =>
      timelineEntries
        .filter((e) => e.accountId === accountId)
        .slice()
        .sort((a, b) => a.entryDate.localeCompare(b.entryDate)),
    [timelineEntries, accountId]
  );
  return { data, isLoading: false };
}

export function useAddEntry() {
  const addEntry = useDataStore((s) => s.addEntry);
  return {
    mutateAsync: async (data: CreateInput) => { addEntry(data); },
    mutate: (data: CreateInput) => { addEntry(data); },
    isPending: false,
  };
}

export function useUpdateEntry() {
  const updateEntry = useDataStore((s) => s.updateEntry);
  return {
    mutateAsync: async ({ id, accountId: _aid, ...patch }: UpdateInput) => { updateEntry(id, patch); },
    mutate: ({ id, accountId: _aid, ...patch }: UpdateInput) => { updateEntry(id, patch); },
    isPending: false,
  };
}

export function useDeleteEntry() {
  const deleteEntry = useDataStore((s) => s.deleteEntry);
  return {
    mutateAsync: async ({ id }: { id: string; accountId: string }) => { deleteEntry(id); },
    mutate: ({ id }: { id: string; accountId: string }) => { deleteEntry(id); },
    isPending: false,
  };
}
