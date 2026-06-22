import { Download } from 'lucide-react';
import type { Account, TimelineEntry } from '../../types';
import { exportAccountsReport, exportSingleAccount } from '../../utils/excelExport';

interface Props {
  accounts: Account[];
  entries?: TimelineEntry[];
  mode: 'single' | 'all';
}

export default function ExportButton({ accounts, entries, mode }: Props) {
  const handleExport = () => {
    if (mode === 'single' && accounts[0] && entries) {
      exportSingleAccount(accounts[0], entries);
    } else {
      exportAccountsReport(accounts);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
    >
      <Download size={15} />
      Export Excel
    </button>
  );
}
