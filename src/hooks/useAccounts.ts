import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import type { Account } from '../types';

type CreateInput = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateInput = { id: string } & Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>;

export function useAccounts(ownerName?: string | null) {
  return useQuery({
    queryKey: ['accounts', ownerName ?? 'all'],
    queryFn: async () => {
      const col = collection(db!, 'accounts');
      const q = ownerName ? query(col, where('ownerName', '==', ownerName)) : col;
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Account));
    },
    enabled: !!db,
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: async () => {
      const snap = await getDoc(doc(db!, 'accounts', id));
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as Account;
    },
    enabled: !!id && !!db,
  });
}

export function useAddAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInput) =>
      addDoc(collection(db!, 'accounts'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: UpdateInput) =>
      updateDoc(doc(db!, 'accounts', id), { ...patch, updatedAt: serverTimestamp() }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['account', vars.id] });
    },
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDoc(doc(db!, 'accounts', id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}
