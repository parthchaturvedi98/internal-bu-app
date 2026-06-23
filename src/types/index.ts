export type PipelineStage =
  | 'qualify'
  | 'commercial'
  | 'provisioned'
  | 'discover'
  | 'workshop'
  | 'pilot_pov'
  | 'close';

export type PursuitType = 'transactional' | 'transformational';

export interface Account {
  id: string;
  name: string;           // Company / account name  e.g. "Office Depot"
  dealName: string;       // Deal description        e.g. "Renewal ADM deal"
  pursuitType: PursuitType;
  stage: PipelineStage;
  ownerName: string;
  ownerEmail: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEntry {
  id: string;
  accountId: string;
  entryDate: string;      // YYYY-MM-DD
  title: string;
  notes?: string;
  createdAt: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  'qualify', 'commercial', 'provisioned', 'discover', 'workshop', 'pilot_pov', 'close',
];

export const STAGE_LABELS: Record<PipelineStage, string> = {
  qualify:     'Qualify',
  commercial:  'Commercial',
  provisioned: 'Provisioned',
  discover:    'Discover',
  workshop:    'Workshop',
  pilot_pov:   'Pilot/PoV',
  close:       'Close',
};

export const PURSUIT_LABELS: Record<PursuitType, string> = {
  transactional:    'Transactional',
  transformational: 'Transformational',
};

export const PURSUIT_COLORS: Record<PursuitType, string> = {
  transactional:    'bg-indigo-100 text-indigo-800',
  transformational: 'bg-blue-100 text-blue-800',
};
