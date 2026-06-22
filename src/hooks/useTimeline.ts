import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGraphClient } from '../lib/graphClient';
import { timelineUrl } from '../lib/sharepointConfig';
import type { TimelineEntry } from '../types';

function mapEntry(item: Record<string, unknown>): TimelineEntry {
  const f = item.fields as Record<string, string>;
  return {
    id: item.id as string,
    accountId: f.AccountId ?? '',
    entryDate: (f.EntryDate ?? '').split('T')[0],
    title: f.Title ?? '',
    notes: f.Notes ?? '',
    createdAt: item.createdDateTime as string,
  };
}

type CreateInput = Omit<TimelineEntry, 'id' | 'createdAt'>;
type UpdateInput = { id: string; accountId: string } & Partial<Pick<TimelineEntry, 'entryDate' | 'title' | 'notes'>>;

export function useTimeline(accountId: string) {
  return useQuery({
    queryKey: ['timeline', accountId],
    queryFn: async () => {
      const gc = getGraphClient();
      const safe = accountId.replace(/'/g, "''");
      const url = `${timelineUrl()}?$expand=fields&$filter=fields/AccountId eq '${safe}'`;
      const res = await gc.api(url).get();
      const entries = ((res.value ?? []) as Record<string, unknown>[]).map(mapEntry);
      return entries.sort((a, b) => a.entryDate.localeCompare(b.entryDate));
    },
    enabled: !!accountId,
  });
}

export function useAddEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateInput) => {
      const gc = getGraphClient();
      return gc.api(timelineUrl()).post({
        fields: {
          Title: data.title,
          AccountId: data.accountId,
          EntryDate: data.entryDate,
          Notes: data.notes ?? '',
        },
      });
    },
    onSuccess: (_data, vars: CreateInput) =>
      qc.invalidateQueries({ queryKey: ['timeline', vars.accountId] }),
  });
}

export function useUpdateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, accountId: _aid, ...patch }: UpdateInput) => {
      const gc = getGraphClient();
      const fields: Record<string, unknown> = {};
      if (patch.title !== undefined) fields.Title = patch.title;
      if (patch.entryDate !== undefined) fields.EntryDate = patch.entryDate;
      if (patch.notes !== undefined) fields.Notes = patch.notes;
      return gc.api(`${timelineUrl()}/${id}/fields`).patch(fields);
    },
    onSuccess: (_data, vars: UpdateInput) =>
      qc.invalidateQueries({ queryKey: ['timeline', vars.accountId] }),
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; accountId: string }) => {
      const gc = getGraphClient();
      return gc.api(`${timelineUrl()}/${id}`).delete();
    },
    onSuccess: (_data, vars: { id: string; accountId: string }) =>
      qc.invalidateQueries({ queryKey: ['timeline', vars.accountId] }),
  });
}
