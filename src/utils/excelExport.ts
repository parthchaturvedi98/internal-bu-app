import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';
import type { Account, TimelineEntry } from '../types';
import { STAGE_LABELS, PURSUIT_LABELS } from '../types';

function formatDate(d: string) {
  try { return format(parseISO(d), 'yyyy-MM-dd'); } catch { return d; }
}

function buildAccountSheet(account: Account, entries: TimelineEntry[]) {
  const rows: (string | null)[][] = [
    [`Account: ${account.name}`],
    [`Deal: ${account.dealName}`],
    [`Pursuit type: ${PURSUIT_LABELS[account.pursuitType]}`, `Stage: ${STAGE_LABELS[account.stage]}`, `Owner: ${account.ownerName}`],
    [`Notes: ${account.description ?? '—'}`],
    [],
    ['Date', 'Activity / Milestone', 'Notes'],
    ...entries.map((e) => [e.entryDate, e.title, e.notes ?? '']),
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 14 }, { wch: 40 }, { wch: 60 }];
  return ws;
}

export function exportSingleAccount(account: Account, entries: TimelineEntry[]) {
  const wb = XLSX.utils.book_new();
  const ws = buildAccountSheet(account, entries);
  const sheetName = account.name.replace(/[\\/*?:[\]]/g, '').slice(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${account.name}-pursuit.xlsx`);
}

export function exportAccountsReport(accounts: Account[]) {
  const wb = XLSX.utils.book_new();

  const summaryRows = [
    ['Account', 'Deal / Pursuit', 'Pursuit Type', 'Stage', 'Owner', 'Notes'],
    ...accounts.map((a) => [
      a.name,
      a.dealName,
      PURSUIT_LABELS[a.pursuitType],
      STAGE_LABELS[a.stage],
      a.ownerName,
      a.description ?? '',
    ]),
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 22 }, { wch: 30 }, { wch: 18 }, { wch: 15 }, { wch: 20 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  XLSX.writeFile(wb, `pursuits-${formatDate(new Date().toISOString())}.xlsx`);
}
