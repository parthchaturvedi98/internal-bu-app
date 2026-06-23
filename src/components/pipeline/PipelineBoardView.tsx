import { useNavigate } from 'react-router-dom';
import type { Account, PipelineStage } from '../../types';
import { PIPELINE_STAGES, STAGE_LABELS, PURSUIT_COLORS } from '../../types';

interface Props {
  accounts: Account[];
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const STAGE_CONFIG: Record<PipelineStage, {
  headerBg: string; colBg: string; cardHover: string; avatarBg: string; countBg: string;
}> = {
  qualify:     { headerBg: 'bg-slate-800', colBg: 'bg-slate-50',     cardHover: 'hover:border-slate-400 hover:shadow-slate-100',    avatarBg: 'bg-slate-700',    countBg: 'bg-slate-600' },
  commercial:  { headerBg: 'bg-slate-700', colBg: 'bg-slate-50',     cardHover: 'hover:border-slate-400 hover:shadow-slate-100',    avatarBg: 'bg-slate-600',    countBg: 'bg-slate-500' },
  provisioned: { headerBg: 'bg-slate-600', colBg: 'bg-slate-50',     cardHover: 'hover:border-slate-400 hover:shadow-slate-100',    avatarBg: 'bg-slate-500',    countBg: 'bg-slate-400' },
  discover:    { headerBg: 'bg-blue-800',  colBg: 'bg-blue-50',      cardHover: 'hover:border-blue-400 hover:shadow-blue-100',      avatarBg: 'bg-blue-700',     countBg: 'bg-blue-600' },
  workshop:    { headerBg: 'bg-blue-700',  colBg: 'bg-blue-50',      cardHover: 'hover:border-blue-400 hover:shadow-blue-100',      avatarBg: 'bg-blue-600',     countBg: 'bg-blue-500' },
  pilot_pov:   { headerBg: 'bg-blue-600',  colBg: 'bg-blue-50',      cardHover: 'hover:border-blue-400 hover:shadow-blue-100',      avatarBg: 'bg-blue-500',     countBg: 'bg-blue-400' },
  close:       { headerBg: 'bg-emerald-700', colBg: 'bg-emerald-50', cardHover: 'hover:border-emerald-400 hover:shadow-emerald-100', avatarBg: 'bg-emerald-600',  countBg: 'bg-emerald-500' },
};

export default function PipelineBoardView({ accounts }: Props) {
  const navigate = useNavigate();

  const byStage: Record<PipelineStage, Account[]> = {
    qualify: [], commercial: [], provisioned: [],
    discover: [], workshop: [], pilot_pov: [], close: [],
  };
  accounts.forEach((a) => byStage[a.stage]?.push(a));

  return (
    <div className="overflow-x-auto select-none pb-2">
      <div className="min-w-[900px]">
        {/* Group band */}
        <div className="flex gap-2 mb-1.5">
          <div className="flex-[3] text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500 bg-slate-100 rounded-md py-1">
            Transactional — Resell / API tokens
          </div>
          <div className="flex-[3] text-center text-[11px] font-semibold tracking-wider uppercase text-blue-500 bg-blue-50 rounded-md py-1">
            Transformational — Services led
          </div>
          <div className="flex-[1] text-center text-[11px] font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 rounded-md py-1">
            Won
          </div>
        </div>

        {/* Columns */}
        <div className="flex gap-2">
          {PIPELINE_STAGES.map((stage) => {
            const cards = byStage[stage];
            const cfg = STAGE_CONFIG[stage];
            return (
              <div key={stage} className="flex-1 min-w-0 flex flex-col rounded-xl overflow-hidden shadow-sm border border-gray-200/80">
                {/* Header */}
                <div className={`${cfg.headerBg} px-3 py-2.5 flex items-center justify-between gap-2`}>
                  <span className="text-white text-xs font-semibold truncate">{STAGE_LABELS[stage]}</span>
                  <span className={`${cfg.countBg} text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5`}>
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div className={`${cfg.colBg} flex-1 p-2 space-y-2 min-h-[180px]`}>
                  {cards.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-gray-300 text-xs py-6">Empty</span>
                    </div>
                  )}
                  {cards.map((account) => (
                    <div
                      key={account.id}
                      onClick={() => navigate(`/accounts/${account.id}`)}
                      className={`bg-white rounded-lg border border-gray-200 p-3 cursor-pointer transition-all hover:shadow-md ${cfg.cardHover} group`}
                    >
                      <p className="font-semibold text-gray-900 text-[13px] leading-tight mb-0.5 group-hover:text-blue-700 transition-colors">
                        {account.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mb-2.5 leading-tight line-clamp-2">
                        {account.dealName}
                      </p>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className={`w-5 h-5 rounded-full ${cfg.avatarBg} text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0`}>
                            {initials(account.ownerName)}
                          </div>
                          <span className="text-[10px] text-gray-400 truncate">{account.ownerName.split(' ')[0]}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${PURSUIT_COLORS[account.pursuitType]}`}>
                          {account.pursuitType === 'transactional' ? 'Tx' : 'Tr'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
