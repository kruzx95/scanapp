import { describe, it, expect } from 'vitest';
import { generateCsvContent } from './exportCsv';
import { Expense } from '../types';

describe('exportCsv', () => {
  it('generates valid CSV string with headers and escaped commas', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        user_id: 'user_1',
        title: 'Kopi, Roti & Susu',
        amount: 35000,
        category: 'Makanan & Minuman',
        date: '2026-11-05',
        notes: 'Sarapan pagi',
        created_at: '2026-11-05T08:00:00Z'
      }
    ];

    const csv = generateCsvContent(expenses);
    expect(csv).toContain('ID,User,Tanggal,Judul,Kategori,Nominal (Rp),Catatan');
    expect(csv).toContain('"Kopi, Roti & Susu"');
    expect(csv).toContain('35000');
    expect(csv).toContain('user_1');
  });
});

