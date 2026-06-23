import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Target } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { useAppStore } from '../../store/useAppStore';
import AccountForm from './AccountForm';
import ExportButton from '../common/ExportButton';
import PipelineBar from '../pipeline/PipelineBar';
import { PIPELINE_STAGES, STAGE_LABELS, PURSUIT_COLORS, PURSUIT_LABELS } from '../../types';
import type { Account } from '../../types';

interface Props {
  showAll?: boolean;
}

export default function AccountsListPage({ showAll }: Props) {
  const navigate = useNavigate();
  const selectedMember = useAppStore((s) => s.selectedMember);
  const statusFilter = useAppStore((s) => s.statusFilter);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setStatusFilter = useAppStore((s) => s.setStatusFilter);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const [showForm, setShowForm] = useState(false);

  const ownerFilter = showAll ? null : selectedMember;
  const { data: accounts = [], isLoading } = useAccounts(ownerFilter);

  const filtered = accounts.filter((a: Account) => {
    const matchStage = statusFilter === 'all' || a.stage === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q
      || a.name.toLowerCase().includes(q)
      || a.dealName.toLowerCase().includes(q)
      || a.ownerName.toLowerCase().includes(q);
    return matchStage && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          {showAll ? 'All Pursuits' : `${selectedMember ? `${selectedMember}'s` : 'My'} Pursuits`}
        </h1>
        <div className="flex items-center gap-2">
          <ExportButton accounts={filtered} mode="all" />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={15} />
            New Pursuit
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pursuits..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All stages</option>
          {PIPELINE_STAGES.map((s) => (
            <option key={s} value={s}>{STAGE_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <Target size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No pursuits found.</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-blue-600 text-sm hover:underline">
            Add your first pursuit
          </button>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid gap-3">
          {filtered.map((account: Account) => (
            <div
              key={account.id}
              onClick={() => navigate(`/accounts/${account.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-semibold text-gray-900 text-sm">{account.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PURSUIT_COLORS[account.pursuitType]}`}>
                      {PURSUIT_LABELS[account.pursuitType]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{account.dealName}</p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">{account.ownerName}</p>
              </div>
              <PipelineBar stage={account.stage} compact />
            </div>
          ))}
        </div>
      )}

      {showForm && <AccountForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
