import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useAccount, useDeleteAccount } from '../../hooks/useAccounts';
import { useTimeline } from '../../hooks/useTimeline';
import Timeline from '../timeline/Timeline';
import AccountForm from './AccountForm';
import ConfirmDialog from '../common/ConfirmDialog';
import ExportButton from '../common/ExportButton';
import PipelineBar from '../pipeline/PipelineBar';
import { PURSUIT_COLORS, PURSUIT_LABELS, STAGE_LABELS } from '../../types';

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const { data: account, isLoading } = useAccount(id!);
  const { data: entries = [] } = useTimeline(id!);
  const deleteAccount = useDeleteAccount();

  if (isLoading) {
    return <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>;
  }

  if (!account) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-sm">Pursuit not found.</p>
        <button onClick={() => navigate('/')} className="mt-2 text-blue-600 text-sm hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteAccount.mutateAsync(account.id);
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-lg font-semibold text-gray-900">{account.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PURSUIT_COLORS[account.pursuitType]}`}>
                {PURSUIT_LABELS[account.pursuitType]}
              </span>
            </div>
            <p className="text-sm text-gray-500">{account.dealName}</p>
            {account.description && (
              <p className="text-sm text-gray-400 mt-2">{account.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-3">
              Owner: <span className="font-medium text-gray-600">{account.ownerName}</span>
              <span className="mx-2 text-gray-300">·</span>
              Stage: <span className="font-medium text-gray-600">{STAGE_LABELS[account.stage]}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <ExportButton accounts={[account]} entries={entries} mode="single" />
            <button
              onClick={() => setEditing(true)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Pipeline bar */}
        <div className="pt-4 border-t border-gray-100">
          <PipelineBar stage={account.stage} />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <Timeline accountId={account.id} />
      </div>

      {editing && <AccountForm account={account} onClose={() => setEditing(false)} />}

      {confirming && (
        <ConfirmDialog
          message={`Delete "${account.name} — ${account.dealName}"? All timeline entries will also be deleted. This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
