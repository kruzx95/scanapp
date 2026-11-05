import { FC } from 'react';
import { Expense } from '../../types';
import { ExpenseItem } from './ExpenseItem';
import { Inbox } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const ExpenseList: FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center border border-slate-100 shadow-xs">
        <Inbox className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-3 text-sm font-bold text-slate-600">Belum ada catatan pengeluaran</p>
        <p className="mt-1 text-xs text-slate-400">
          Gunakan tombol Scan Struk atau Input Manual di bawah untuk mulai mencatat.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map(expense => (
        <ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />
      ))}
    </div>
  );
};

