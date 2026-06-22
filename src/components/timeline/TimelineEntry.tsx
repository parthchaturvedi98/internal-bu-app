import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useDeleteEntry } from '../../hooks/useTimeline';
import ConfirmDialog from '../common/ConfirmDialog';
import TimelineEntryForm from './TimelineEntryForm';
import type { TimelineEntry as TEntry } from '../../types';

interface Props {
  entry: TEntry;
  isLast: boolean;
}

export default function TimelineEntry({ entry, isLast }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const deleteEntry = useDeleteEntry();

  const formattedDate = (() => {
    try { return format(parseISO(entry.entryDate), 'MMM d, yyyy'); }
    catch { return entry.entryDate; }
  })();

  if (editing) {
    return (
      <div className="ml-6 pl-6 border-l-2 border-blue-200 pb-6">
        <TimelineEntryForm
          accountId={entry.accountId}
          entry={entry}
          onClose={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div className={`relative flex gap-4 ${!isLast ? 'pb-6' : ''}`}>
        {/* vertical line */}
        {!isLast && (
          <div className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-gray-200" />
        )}
        {/* dot */}
        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-200 mt-0.5" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs text-gray-400 font-medium">{formattedDate}</span>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{entry.title}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {entry.notes && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}
              <button onClick={() => setEditing(true)} className="p-1 text-gray-400 hover:text-blue-600">
                <Pencil size={13} />
              </button>
              <button onClick={() => setConfirming(true)} className="p-1 text-gray-400 hover:text-red-600">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          {expanded && entry.notes && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{entry.notes}</p>
          )}
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          message={`Delete "${entry.title}"? This cannot be undone.`}
          onConfirm={() => {
            deleteEntry.mutate({ id: entry.id, accountId: entry.accountId });
            setConfirming(false);
          }}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}
