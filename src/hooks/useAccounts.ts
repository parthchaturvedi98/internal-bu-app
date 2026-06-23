import { useMemo } from 'react';
import { useDataStore } from '../store/useDataStore';
import type { Account } from '../types';

type CreateInput = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateInput = { id: string } & Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>;

export function useAccounts(ownerName?: string | null) {
  const accounts = useDataStore((s) => s.accounts);
  const data = useMemo(
    () => (ownerName ? accounts.filter((a) => a.ownerName === ownerName) : accounts),
    [accounts, ownerName]
  );
  return { data, isLoading: false };
}

export function useAccount(id: string) {
  const accounts = useDataStore((s) => s.accounts);
  const data = useMemo(() => accounts.find((a) => a.id === id) ?? null, [accounts, id]);
  return { data, isLoading: false };
}

export function useAddAccount() {
  const addAccount = useDataStore((s) => s.addAccount);
  return {
    mutateAsync: async (data: CreateInput) => { addAccount(data); },
    mutate: (data: CreateInput) => { addAccount(data); },
    isPending: false,
  };
}

export function useUpdateAccount() {
  const updateAccount = useDataStore((s) => s.updateAccount);
  return {
    mutateAsync: async ({ id, ...patch }: UpdateInput) => { updateAccount(id, patch); },
    mutate: ({ id, ...patch }: UpdateInput) => { updateAccount(id, patch); },
    isPending: false,
  };
}

export function useDeleteAccount() {
  const deleteAccount = useDataStore((s) => s.deleteAccount);
  return {
    mutateAsync: async (id: string) => { deleteAccount(id); },
    mutate: (id: string) => { deleteAccount(id); },
    isPending: false,
  };
}
