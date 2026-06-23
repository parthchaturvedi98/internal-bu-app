import { PIPELINE_STAGES, STAGE_LABELS } from '../../types';
import type { PipelineStage } from '../../types';

interface Props {
  stage: PipelineStage;
  compact?: boolean;
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

export default function PipelineBar({ stage, compact = false }: Props) {
  const currentIdx = PIPELINE_STAGES.indexOf(stage);

  if (compact) {
    return (
      <div className="flex items-center gap-0">
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
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Group labels */}
      <div className="flex mb-2">
        <div className="flex-[3] text-center">
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            Transactional
          </span>
        </div>
        <div className="flex-[4] text-center">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            Transformational
          </span>
        </div>
      </div>

      {/* Stage nodes */}
      <div className="relative flex items-center">
        {STAGE_META.map((s, i) => {
          const isPast    = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isNav     = s.group === 'transactional';

          const circleClass = isCurrent
            ? isNav
              ? 'w-5 h-5 rounded-full bg-slate-700 ring-2 ring-slate-400 ring-offset-2 z-10'
              : 'w-5 h-5 rounded-full bg-blue-600 ring-2 ring-blue-400 ring-offset-2 z-10'
            : isPast
              ? isNav ? 'w-4 h-4 rounded-full bg-slate-400' : 'w-4 h-4 rounded-full bg-blue-300'
              : 'w-4 h-4 rounded-full bg-gray-200 border border-gray-300';

          const lineColor = i <= currentIdx
            ? s.group === 'transactional' ? 'bg-slate-400' : 'bg-blue-300'
            : 'bg-gray-200';

          return (
            <div key={s.key} className="flex-1 flex flex-col items-center relative">
              {/* Connecting line to previous */}
              {i > 0 && (
                <div className={`absolute top-2 right-1/2 h-0.5 w-full ${lineColor}`} style={{ transform: 'translateY(-50%)' }} />
              )}
              <div className={`relative ${circleClass}`} />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex mt-1.5">
        {STAGE_META.map((s, i) => {
          const isCurrent = i === currentIdx;
          return (
            <div key={s.key} className="flex-1 text-center">
              <span className={`text-xs leading-tight block ${
                isCurrent
                  ? s.group === 'transactional' ? 'font-semibold text-slate-700' : 'font-semibold text-blue-700'
                  : 'text-gray-400'
              }`}>
                {STAGE_LABELS[s.key]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
