import { PIPELINE_STAGES, STAGE_LABELS } from '../../types';
import type { PipelineStage } from '../../types';

interface Props {
  stage: PipelineStage;
  compact?: boolean;
  onStageChange?: (stage: PipelineStage) => void;
}

const STAGE_META: { key: PipelineStage; group: 'transactional' | 'transformational' }[] = [
  { key: 'qualify',     group: 'transactional' },
  { key: 'commercial',  group: 'transactional' },
  { key: 'provisioned', group: 'transactional' },
  { key: 'discover',    group: 'transformational' },
  { key: 'workshop',    group: 'transformational' },
  { key: 'pilot_pov',   group: 'transformational' },
  { key: 'close',       group: 'transformational' },
];

export default function PipelineBar({ stage, compact = false, onStageChange }: Props) {
  const currentIdx = PIPELINE_STAGES.indexOf(stage);
  const interactive = !!onStageChange;

  if (compact) {
    return (
      <div className="flex items-center">
        {STAGE_META.map((s, i) => {
          const isPast    = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isNav     = s.group === 'transactional';
          const dotColor  = isCurrent
            ? isNav ? 'bg-slate-700 ring-2 ring-slate-400 ring-offset-1' : 'bg-blue-600 ring-2 ring-blue-400 ring-offset-1'
            : isPast
              ? isNav ? 'bg-slate-400' : 'bg-blue-300'
              : 'bg-gray-200';

          return (
            <div key={s.key} className="flex items-center">
              {i > 0 && (
                <div className={`h-px w-4 ${
                  i <= currentIdx
                    ? s.group === 'transactional' ? 'bg-slate-400' : 'bg-blue-300'
                    : 'bg-gray-200'
                }`} />
              )}
              <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} title={STAGE_LABELS[s.key]} />
            </div>
          );
        })}
        <span className="ml-2 text-[11px] text-gray-400 font-medium">{STAGE_LABELS[stage]}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {interactive && (
        <p className="text-[11px] text-gray-400 mb-3 text-center">Click a stage to advance this pursuit</p>
      )}

      {/* Stage nodes row */}
      <div className="relative flex items-center">
        {STAGE_META.map((s, i) => {
          const isPast    = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isNav     = s.group === 'transactional';

          const circleBase = 'rounded-full transition-all duration-150 flex items-center justify-center relative z-10';
          const sizeClass  = isCurrent ? 'w-6 h-6' : 'w-4 h-4';

          const colorClass = isCurrent
            ? isNav
              ? 'bg-slate-700 ring-4 ring-slate-200 shadow-md'
              : s.key === 'close'
                ? 'bg-emerald-600 ring-4 ring-emerald-200 shadow-md'
                : 'bg-blue-600 ring-4 ring-blue-200 shadow-md'
            : isPast
              ? isNav ? 'bg-slate-400' : 'bg-blue-300'
              : 'bg-gray-200 border-2 border-gray-300';

          const hoverClass = interactive && !isCurrent
            ? isNav
              ? 'hover:bg-slate-500 hover:scale-110 cursor-pointer'
              : s.key === 'close'
                ? 'hover:bg-emerald-500 hover:scale-110 cursor-pointer'
                : 'hover:bg-blue-500 hover:scale-110 cursor-pointer'
            : interactive ? 'cursor-default' : '';

          const lineColor = i <= currentIdx
            ? s.group === 'transactional' ? 'bg-slate-400' : s.key === 'close' ? 'bg-emerald-400' : 'bg-blue-300'
            : 'bg-gray-200';

          const node = (
            <div className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div
                  className={`absolute top-1/2 right-1/2 h-0.5 w-full -translate-y-1/2 ${lineColor}`}
                />
              )}
              <div
                title={interactive && !isCurrent ? `Move to ${STAGE_LABELS[s.key]}` : STAGE_LABELS[s.key]}
                onClick={() => interactive && !isCurrent && onStageChange?.(s.key)}
                className={`${circleBase} ${sizeClass} ${colorClass} ${hoverClass}`}
              >
                {isCurrent && (
                  <div className="w-2 h-2 rounded-full bg-white/70" />
                )}
              </div>
            </div>
          );

          return <div key={s.key} className="flex-1 flex flex-col items-center">{node}</div>;
        })}
      </div>

      {/* Labels */}
      <div className="flex mt-2">
        {STAGE_META.map((s, i) => {
          const isCurrent = i === currentIdx;
          return (
            <div key={s.key} className="flex-1 text-center px-0.5">
              <span className={`text-[11px] leading-tight block ${
                isCurrent
                  ? s.group === 'transactional'
                    ? 'font-bold text-slate-700'
                    : s.key === 'close'
                      ? 'font-bold text-emerald-700'
                      : 'font-bold text-blue-700'
                  : 'text-gray-400'
              }`}>
                {STAGE_LABELS[s.key]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Group labels */}
      <div className="flex mt-2.5 gap-1">
        <div className="flex-[3] text-center text-[10px] text-slate-400 font-medium border-t-2 border-slate-200 pt-1">
          Transactional
        </div>
        <div className="flex-[3] text-center text-[10px] text-blue-400 font-medium border-t-2 border-blue-200 pt-1">
          Transformational
        </div>
        <div className="flex-[1] text-center text-[10px] text-emerald-500 font-medium border-t-2 border-emerald-200 pt-1">
          Won
        </div>
      </div>
    </div>
  );
}
