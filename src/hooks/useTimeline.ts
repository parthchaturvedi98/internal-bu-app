import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import type { TimelineEntry } from '../types';

type CreateInput = Omit<TimelineEntry, 'id' | 'createdAt'>;
type UpdateInput = { id: string; accountId: string } & Partial<Pick<TimelineEntry, 'entryDate' | 'title' | 'notes'>>;

export function useTimeline(accountId: string) {
  return useQuery({
    queryKey: ['timeline', accountId],
    queryFn: async () => {
      const q = query(
        collection(db!, 'timeline_entries'),
        where('accountId', '==', accountId),
        orderBy('entryDate'),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TimelineEntry));
    },
    enabled: !!accountId && !!db,
  });
}

export function useAddEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInput) =>
      addDoc(collection(db!, 'timeline_entries'), { ...data, createdAt: serverTimestamp() }),
    onSuccess: (_data, vars: CreateInput) =>
      qc.invalidateQueries({ queryKey: ['timeline', vars.accountId] }),
  });
}

export function useUpdateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accountId: _aid, ...patch }: UpdateInput) =>
      updateDoc(doc(db!, 'timeline_entries', id), patch),
    onSuccess: (_data, vars: UpdateInput) =>
      qc.invalidateQueries({ queryKey: ['timeline', vars.accountId] }),
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; accountId: string }) =>
      deleteDoc(doc(db!, 'timeline_entries', id)),
    onSuccess: (_data, vars: { id: string; accountId: string }) =>
      qc.invalidateQueries({ queryKey: ['timeline', vars.accountId] }),
  });
}
