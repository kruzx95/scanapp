import { Expense, DateFilter, ExpenseCategory } from '../types';

export interface CategoryBreakdown {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
}

export function calculateTotalExpense(expenses: Expense[]): number {
  return expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
}

export function filterExpensesByDateRange(
  expenses: Expense[],
  filter: DateFilter,
  referenceDateStr: string = new Date().toISOString().split('T')[0]
): Expense[] {
  if (filter === 'all') return expenses;

  const [refYear, refMonth, refDay] = referenceDateStr.split('-').map(Number);
  const refDate = new Date(refYear, refMonth - 1, refDay);

  return expenses.filter(item => {
    if (!item.date) return false;
    const [y, m, d] = item.date.split('-').map(Number);
    const itemDate = new Date(y, m - 1, d);

    if (filter === 'today') {
      return item.date === referenceDateStr;
    }

    if (filter === 'week') {
      const diffTime = refDate.getTime() - itemDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }

    if (filter === 'month') {
      return y === refYear && m === refMonth;
    }

    return true;
  });
}

export function calculateCategoryBreakdown(expenses: Expense[]): CategoryBreakdown[] {
  const total = calculateTotalExpense(expenses);
  const map = new Map<ExpenseCategory, { total: number; count: number }>();

  for (const exp of expenses) {
    const existing = map.get(exp.category) || { total: 0, count: 0 };
    existing.total += Number(exp.amount) || 0;
    existing.count += 1;
    map.set(exp.category, existing);
  }

  const result: CategoryBreakdown[] = [];
  for (const [category, data] of map.entries()) {
    result.push({
      category,
      total: data.total,
      count: data.count,
      percentage: total > 0 ? Math.round((data.total / total) * 100) : 0
    });
  }

  return result.sort((a, b) => b.total - a.total);
}

