import { describe, it, expect } from 'vitest';
import { calculateTotalExpense, filterExpensesByDateRange, calculateCategoryBreakdown } from './calculations';
import { Expense } from '../types';

const mockExpenses: Expense[] = [
  {
    id: '1',
    user_id: 'user_1',
    title: 'Makan Pagi',
    amount: 25000,
    category: 'Makanan & Minuman',
    date: '2026-11-05',
    created_at: '2026-11-05T08:00:00Z'
  },
  {
    id: '2',
    user_id: 'user_1',
    title: 'Bensin Motor',
    amount: 50000,
    category: 'Transportasi & Bensin',
    date: '2026-11-05',
    created_at: '2026-11-05T09:00:00Z'
  },
  {
    id: '3',
    user_id: 'user_1',
    title: 'Supermarket',
    amount: 150000,
    category: 'Belanja Harian',
    date: '2026-11-01',
    created_at: '2026-11-01T12:00:00Z'
  }
];

describe('calculations', () => {
  it('calculates total expense amount correctly', () => {
    expect(calculateTotalExpense([])).toBe(0);
    expect(calculateTotalExpense(mockExpenses)).toBe(225000);
  });

  it('filters expenses by today date', () => {
    const todayExpenses = filterExpensesByDateRange(mockExpenses, 'today', '2026-11-05');
    expect(todayExpenses).toHaveLength(2);
    expect(todayExpenses.map(e => e.id)).toEqual(['1', '2']);
  });

  it('filters expenses by month', () => {
    const monthExpenses = filterExpensesByDateRange(mockExpenses, 'month', '2026-11-05');
    expect(monthExpenses).toHaveLength(3);
  });

  it('aggregates category breakdown with totals and percentages', () => {
    const breakdown = calculateCategoryBreakdown(mockExpenses);
    expect(breakdown).toHaveLength(3);
    const belanja = breakdown.find(b => b.category === 'Belanja Harian');
    expect(belanja).toBeDefined();
    expect(belanja?.total).toBe(150000);
    expect(belanja?.count).toBe(1);
    expect(belanja?.percentage).toBe(67);
  });
});

