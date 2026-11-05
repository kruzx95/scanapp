import { useState, FC } from 'react';
import { Expense } from '../../types';
import { formatIDR, formatDateIndo } from '../../utils/formatters';
import { Trash2, ChevronDown, ChevronUp, Receipt } from 'lucide-react';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

export const ExpenseItem: FC<ExpenseItemProps> = ({ expense, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const hasItems = expense.receipt_items && expense.receipt_items.length > 0;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-xs border border-slate-100 transition hover:border-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800 text-sm">{expense.title}</h4>
            {!expense.synced && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                Offline
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
              {expense.category}
            </span>
            <span>•</span>
            <span>{formatDateIndo(expense.date)}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-extrabold text-slate-800">
            {formatIDR(expense.amount)}
          </div>
          <button
            type="button"
            aria-label="Hapus transaksi"
            onClick={() => onDelete(expense.id)}
            className="mt-1 text-slate-300 hover:text-rose-500 p-1 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {hasItems && (
        <div className="mt-3 pt-2.5 border-t border-slate-50">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>Lihat {expense.receipt_items?.length} barang struk</span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {expanded && (
            <div className="mt-2 space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs">
              {expense.receipt_items?.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-600">
                  <span>{it.name} <span className="text-slate-400">x{it.quantity}</span></span>
                  <span className="font-semibold text-slate-800">{formatIDR(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

