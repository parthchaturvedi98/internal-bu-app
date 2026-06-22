import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import type { Account } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const models = (client as any).models;

type CreateInput = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateInput = { id: string } & Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>;

export function useAccounts(ownerName?: string | null) {
  return useQuery({
    queryKey: ['accounts', ownerName ?? 'all'],
    queryFn: async () => {
      const result = await models.Account.list(
        ownerName ? { filter: { ownerName: { eq: ownerName } } } : undefined
      );
      return (result.data ?? []) as Account[];
    },
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: async () => {
      const result = await models.Account.get({ id });
      return result.data as Account | null;
    },
    enabled: !!id,
  });
}

export function useAddAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInput) => models.Account.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: UpdateInput) => models.Account.update({ id, ...patch }),
    onSuccess: (_data: unknown, vars: UpdateInput) => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['account', vars.id] });
    },
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => models.Account.delete({ id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}
