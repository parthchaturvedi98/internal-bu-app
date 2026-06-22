import { useState } from 'react';
import { Plus, CalendarDays } from 'lucide-react';
import { useTimeline } from '../../hooks/useTimeline';
import TimelineEntry from './TimelineEntry';
import TimelineEntryForm from './TimelineEntryForm';

interface Props {
  accountId: string;
}

export default function Timeline({ accountId }: Props) {
  const { data: entries = [], isLoading } = useTimeline(accountId);
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 text-sm">Timeline</h3>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus size={14} />
          Add milestone
        </button>
      </div>

      {adding && (
        <TimelineEntryForm accountId={accountId} onClose={() => setAdding(false)} />
      )}

      {isLoading && (
        <p className="text-sm text-gray-400 py-4">Loading timeline...</p>
      )}

      {!isLoading && entries.length === 0 && !adding && (
        <div className="text-center py-8">
          <CalendarDays size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">No milestones yet.</p>
          <button onClick={() => setAdding(true)} className="mt-2 text-blue-600 text-xs hover:underline">
            Add the first one
          </button>
        </div>
      )}

      {!isLoading && entries.length > 0 && (
        <div className="mt-4">
          {entries.map((entry, i) => (
            <TimelineEntry
              key={entry.id}
              entry={entry}
              isLast={i === entries.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
