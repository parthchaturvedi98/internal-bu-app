import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAddEntry, useUpdateEntry } from '../../hooks/useTimeline';
import type { TimelineEntry } from '../../types';

interface FormValues {
  entryDate: string;
  title: string;
  notes: string;
}

interface Props {
  accountId: string;
  entry?: TimelineEntry | null;
  onClose: () => void;
}

export default function TimelineEntryForm({ accountId, entry, onClose }: Props) {
  const addEntry = useAddEntry();
  const updateEntry = useUpdateEntry();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      entryDate: new Date().toISOString().split('T')[0],
      title: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (entry) {
      reset({ entryDate: entry.entryDate, title: entry.title, notes: entry.notes ?? '' });
    }
  }, [entry, reset]);

  const onSubmit = async (values: FormValues) => {
    if (entry) {
      await updateEntry.mutateAsync({ id: entry.id, accountId, ...values });
    } else {
      await addEntry.mutateAsync({ accountId, ...values });
    }
    onClose();
  };

  const isPending = addEntry.isPending || updateEntry.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-3 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
          <input
            type="date"
            {...register('entryDate', { required: 'Required' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.entryDate && <p className="text-red-500 text-xs mt-0.5">{errors.entryDate.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Activity / Milestone *</label>
          <input
            {...register('title', { required: 'Required' })}
            placeholder="e.g. First discussion"
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="text-red-500 text-xs mt-0.5">{errors.title.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
        <textarea
          {...register('notes')}
          rows={2}
          placeholder="Additional context..."
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-white text-gray-600">
          Cancel
        </button>
        <button type="submit" disabled={isPending} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {isPending ? 'Saving...' : entry ? 'Update' : 'Add Entry'}
        </button>
      </div>
    </form>
  );
}
