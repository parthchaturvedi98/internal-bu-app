import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGraphClient } from '../lib/graphClient';
import { accountsUrl } from '../lib/sharepointConfig';
import type { Account } from '../types';

function mapItem(item: Record<string, unknown>): Account {
  const f = item.fields as Record<string, string>;
  return {
    id: item.id as string,
    name: f.Title ?? '',
    company: f.Company ?? '',
    status: (f.Status as Account['status']) ?? 'active',
    ownerName: f.OwnerName ?? '',
    ownerEmail: f.OwnerEmail ?? '',
    description: f.Description ?? '',
    createdAt: item.createdDateTime as string,
    updatedAt: item.lastModifiedDateTime as string,
  };
}

type CreateInput = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateInput = { id: string } & Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>;

export function useAccounts(ownerName?: string | null) {
  return useQuery({
    queryKey: ['accounts', ownerName ?? 'all'],
    queryFn: async () => {
      const gc = getGraphClient();
      let url = `${accountsUrl()}?$expand=fields`;
      if (ownerName) {
        const safe = ownerName.replace(/'/g, "''");
        url += `&$filter=fields/OwnerName eq '${safe}'`;
      }
      const res = await gc.api(url).get();
      return ((res.value ?? []) as Record<string, unknown>[]).map(mapItem);
    },
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: async () => {
      const gc = getGraphClient();
      const res = await gc.api(`${accountsUrl()}/${id}?$expand=fields`).get();
      return mapItem(res);
    },
    enabled: !!id,
  });
}

export function useAddAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateInput) => {
      const gc = getGraphClient();
      return gc.api(accountsUrl()).post({
        fields: {
          Title: data.name,
          Company: data.company,
          Status: data.status,
          OwnerName: data.ownerName,
          OwnerEmail: data.ownerEmail,
          Description: data.description ?? '',
        },
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: UpdateInput) => {
      const gc = getGraphClient();
      const fields: Record<string, unknown> = {};
      if (patch.name !== undefined) fields.Title = patch.name;
      if (patch.company !== undefined) fields.Company = patch.company;
      if (patch.status !== undefined) fields.Status = patch.status;
      if (patch.ownerName !== undefined) fields.OwnerName = patch.ownerName;
      if (patch.ownerEmail !== undefined) fields.OwnerEmail = patch.ownerEmail;
      if (patch.description !== undefined) fields.Description = patch.description;
      return gc.api(`${accountsUrl()}/${id}/fields`).patch(fields);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['account', vars.id] });
    },
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const gc = getGraphClient();
      return gc.api(`${accountsUrl()}/${id}`).delete();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}
