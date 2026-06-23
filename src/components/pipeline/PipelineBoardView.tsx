import { useNavigate } from 'react-router-dom';
import type { Account, PipelineStage } from '../../types';
import { PIPELINE_STAGES, STAGE_LABELS, PURSUIT_COLORS } from '../../types';

interface Props {
  accounts: Account[];
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const CFG: Record<PipelineStage, { hd: string; bg: string; av: string; hov: string }> = {
  qualify:     { hd: 'bg-slate-800', bg: 'bg-slate-50',    av: 'bg-slate-600', hov: 'hover:border-slate-400' },
  commercial:  { hd: 'bg-slate-700', bg: 'bg-slate-50',    av: 'bg-slate-500', hov: 'hover:border-slate-400' },
  provisioned: { hd: 'bg-slate-600', bg: 'bg-slate-50',    av: 'bg-slate-500', hov: 'hover:border-slate-400' },
  discover:    { hd: 'bg-blue-800',  bg: 'bg-blue-50',     av: 'bg-blue-700',  hov: 'hover:border-blue-400'  },
  workshop:    { hd: 'bg-blue-700',  bg: 'bg-blue-50',     av: 'bg-blue-600',  hov: 'hover:border-blue-400'  },
  pilot_pov:   { hd: 'bg-blue-600',  bg: 'bg-blue-50',     av: 'bg-blue-500',  hov: 'hover:border-blue-400'  },
  close:       { hd: 'bg-emerald-700', bg: 'bg-emerald-50', av: 'bg-emerald-600', hov: 'hover:border-emerald-400' },
};

export default function PipelineBoardView({ accounts }: Props) {
  const navigate = useNavigate();

  const byStage: Record<PipelineStage, Account[]> = {
    qualify: [], commercial: [], provisioned: [],
    discover: [], workshop: [], pilot_pov: [], close: [],
  };
  accounts.forEach((a) => byStage[a.stage]?.push(a));

  return (
    <div className="overflow-x-auto">
      {/* Fixed-width inner so it scrolls horizontally on small screens */}
      <div style={{ minWidth: '980px' }}>
        {/* Group labels */}
        <div className="flex gap-1.5 mb-1.5">
          <div style={{ flex: 3 }} className="text-center text-[10px] font-bold tracking-widest uppercase text-slate-500 bg-slate-100 rounded py-1">
            Transactional
          </div>
          <div style={{ flex: 3 }} className="text-center text-[10px] font-bold tracking-widest uppercase text-blue-500 bg-blue-50 rounded py-1">
            Transformational
          </div>
          <div style={{ flex: 1 }} className="text-center text-[10px] font-bold tracking-widest uppercase text-emerald-600 bg-emerald-50 rounded py-1">
            Won
          </div>
        </div>

        {/* Columns */}
        <div className="flex gap-1.5">
          {PIPELINE_STAGES.map((stage) => {
            const cards = byStage[stage];
            const c = CFG[stage];
            return (
              <div
                key={stage}
                className="flex flex-col rounded-lg overflow-hidden border border-gray-200"
                style={{ flex: 1, minWidth: '120px' }}
              >
                {/* Header */}
                <div className={`${c.hd} px-2 py-2 flex items-center justify-between`}>
                  <span className="text-white text-[11px] font-semibold leading-tight">{STAGE_LABELS[stage]}</span>
                  <span className="bg-white/25 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div className={`${c.bg} flex-1 p-1.5 space-y-1.5 min-h-[160px]`}>
                  {cards.length === 0 && (
                    <p className="text-center text-gray-300 text-[10px] pt-6">—</p>
                  )}
                  {cards.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => navigate(`/accounts/${a.id}`)}
                      className={`bg-white rounded-lg border border-gray-200 p-2 cursor-pointer transition-all ${c.hov} hover:shadow-sm group`}
                    >
                      <p className="font-semibold text-gray-900 text-[12px] leading-snug mb-0.5 group-hover:text-blue-700 break-words">
                        {a.name}
                      </p>
                      <p className="text-[10px] text-gray-500 mb-2 truncate" title={a.dealName}>
                        {a.dealName}
                      </p>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 min-w-0">
                          <div className={`w-4 h-4 rounded-full ${c.av} text-white text-[8px] font-bold flex items-center justify-center flex-shrink-0`}>
                            {initials(a.ownerName)}
                          </div>
                          <span className="text-[9px] text-gray-400 truncate">{a.ownerName.split(' ')[0]}</span>
                        </div>
                        <span className={`text-[9px] px-1 py-0.5 rounded-full font-semibold flex-shrink-0 ${PURSUIT_COLORS[a.pursuitType]}`}>
                          {a.pursuitType === 'transactional' ? 'Tx' : 'Tr'}
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
