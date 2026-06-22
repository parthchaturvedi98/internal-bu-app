import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';
import type { Account, TimelineEntry } from '../types';

function formatDate(d: string) {
  try { return format(parseISO(d), 'yyyy-MM-dd'); } catch { return d; }
}

function buildAccountSheet(account: Account, entries: TimelineEntry[]) {
  const rows: (string | null)[][] = [
    [`Account: ${account.name} (${account.company})`],
    [`Owner: ${account.ownerName}`, `Status: ${account.status}`, `Email: ${account.ownerEmail}`],
    [`Description: ${account.description ?? '—'}`],
    [],
    ['Date', 'Activity / Milestone', 'Notes'],
    ...entries.map((e) => [e.entryDate, e.title, e.notes ?? '']),
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 14 }, { wch: 35 }, { wch: 60 }];
  return ws;
}

export function exportSingleAccount(account: Account, entries: TimelineEntry[]) {
  const wb = XLSX.utils.book_new();
  const ws = buildAccountSheet(account, entries);
  const sheetName = account.company.replace(/[\\/*?:[\]]/g, '').slice(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${account.company}-timeline.xlsx`);
}

export function exportAccountsReport(accounts: Account[]) {
  const wb = XLSX.utils.book_new();

  const summaryRows = [
    ['Account Name', 'Company', 'Owner', 'Status', 'Description'],
    ...accounts.map((a) => [a.name, a.company, a.ownerName, a.status, a.description ?? '']),
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  XLSX.writeFile(wb, `all-accounts-${formatDate(new Date().toISOString())}.xlsx`);
}
