import { Expense } from '../types';

export function generateCsvContent(expenses: Expense[]): string {
  const headers = ['ID', 'User', 'Tanggal', 'Judul', 'Kategori', 'Nominal (Rp)', 'Catatan'];
  const rows = expenses.map(exp => [
    exp.id,
    exp.user_id,
    exp.date,
    `"${exp.title.replace(/"/g, '""')}"`,
    `"${exp.category}"`,
    exp.amount,
    `"${(exp.notes || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function downloadCsvFile(expenses: Expense[], filename = 'pengeluaran.csv'): void {
  const content = generateCsvContent(expenses);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

