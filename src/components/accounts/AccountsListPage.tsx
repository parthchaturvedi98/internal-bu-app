import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Target, LayoutGrid, List } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import AccountForm from './AccountForm';
import ExportButton from '../common/ExportButton';
import PipelineBar from '../pipeline/PipelineBar';
import PipelineBoardView from '../pipeline/PipelineBoardView';
import { PIPELINE_STAGES, STAGE_LABELS, PURSUIT_COLORS, PURSUIT_LABELS } from '../../types';
import { TEAM_MEMBERS } from '../../config/members';
import type { Account } from '../../types';

export default function AccountsListPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allAccounts = [] } = useAccounts();

  const filtered = allAccounts.filter((a: Account) => {
    const matchOwner = !ownerFilter || a.ownerName === ownerFilter;
    const matchStage = stageFilter === 'all' || a.stage === stageFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.dealName.toLowerCase().includes(q) ||
      a.ownerName.toLowerCase().includes(q);
    return matchOwner && matchStage && matchSearch;
  });

  const txCount = filtered.filter((a) => a.pursuitType === 'transactional').length;
  const trCount = filtered.filter((a) => a.pursuitType === 'transformational').length;

  return (
    <div className="max-w-full">
      {/* Page header */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {ownerFilter ? `${ownerFilter}'s Pursuits` : 'All Pursuits'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {filtered.length} pursuit{filtered.length !== 1 ? 's' : ''}
            {txCount > 0 && <> · <span className="text-slate-600">{txCount} Transactional</span></>}
            {trCount > 0 && <> · <span className="text-blue-600">{trCount} Transformational</span></>}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ExportButton accounts={filtered} mode="all" />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} />
            New Pursuit
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {/* Owner filter */}
        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
        >
          <option value="">All owners</option>
          {TEAM_MEMBERS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Stage filter */}
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
        >
          <option value="all">All stages</option>
          {PIPELINE_STAGES.map((s) => (
            <option key={s} value={s}>{STAGE_LABELS[s]}</option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1 min-w-[160px] max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by account, deal, owner…"
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden ml-auto">
          <button
            onClick={() => setView('board')}
            className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
              view === 'board' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
            title="Board view"
          >
            <LayoutGrid size={14} />
            <span className="hidden sm:inline">Board</span>
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
              view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
            title="List view"
          >
            <List size={14} />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Target size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">
            {ownerFilter ? `No pursuits found for ${ownerFilter}.` : 'No pursuits found.'}
          </p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-blue-600 text-sm hover:underline">
            Add your first pursuit
          </button>
        </div>
      )}

      {filtered.length > 0 && view === 'board' && (
        <PipelineBoardView accounts={filtered} />
      )}

      {filtered.length > 0 && view === 'list' && (
        <div className="grid gap-2">
          {filtered.map((account: Account) => (
            <div
              key={account.id}
              onClick={() => navigate(`/accounts/${account.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                      {account.name}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PURSUIT_COLORS[account.pursuitType]}`}>
                      {PURSUIT_LABELS[account.pursuitType]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{account.dealName}</p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0 pt-0.5">{account.ownerName}</p>
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
