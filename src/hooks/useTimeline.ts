import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import type { TimelineEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const models = (client as any).models;

type CreateInput = Omit<TimelineEntry, 'id' | 'createdAt'>;
type UpdateInput = { id: string; accountId: string } & Partial<Pick<TimelineEntry, 'entryDate' | 'title' | 'notes'>>;

export function useTimeline(accountId: string) {
  return useQuery({
    queryKey: ['timeline', accountId],
    queryFn: async () => {
      const result = await models.TimelineEntry.list({
        filter: { accountId: { eq: accountId } },
      });
      const entries = (result.data ?? []) as TimelineEntry[];
      return entries.sort((a, b) => a.entryDate.localeCompare(b.entryDate));
    },
    enabled: !!accountId,
  });
}

export function useAddEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInput) => models.TimelineEntry.create(data),
    onSuccess: (_data: unknown, vars: CreateInput) =>
      qc.invalidateQueries({ queryKey: ['timeline', vars.accountId] }),
  });
}

export function useUpdateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accountId: _aid, ...patch }: UpdateInput) =>
      models.TimelineEntry.update({ id, ...patch }),
    onSuccess: (_data: unknown, vars: UpdateInput) =>
      qc.invalidateQueries({ queryKey: ['timeline', vars.accountId] }),
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; accountId: string }) =>
      models.TimelineEntry.delete({ id }),
    onSuccess: (_data: unknown, vars: { id: string; accountId: string }) =>
      qc.invalidateQueries({ queryKey: ['timeline', vars.accountId] }),
  });
}
