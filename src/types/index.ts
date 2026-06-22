export interface Account {
  id: string;
  name: string;
  company: string;
  status: 'active' | 'on_hold' | 'closed' | 'won' | 'lost';
  ownerName: string;
  ownerEmail: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimelineEntry {
  id: string;
  accountId: string;
  entryDate: string;
  title: string;
  notes?: string | null;
  createdAt?: string;
}

export const STATUS_LABELS: Record<Account['status'], string> = {
  active:   'Active',
  on_hold:  'On Hold',
  closed:   'Closed',
  won:      'Won',
  lost:     'Lost',
};

export const STATUS_COLORS: Record<Account['status'], string> = {
  active:   'bg-green-100 text-green-800',
  on_hold:  'bg-yellow-100 text-yellow-800',
  closed:   'bg-gray-100 text-gray-700',
  won:      'bg-blue-100 text-blue-800',
  lost:     'bg-red-100 text-red-800',
};
