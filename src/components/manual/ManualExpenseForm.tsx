import { useState, FC, FormEvent, ChangeEvent } from 'react';
import { Expense, ExpenseCategory } from '../../types';
import { getTodayDateString, parseIDR, formatIDR } from '../../utils/formatters';
import { PlusCircle, Utensils, ShoppingBag, Car, Receipt, Gamepad2, HeartPulse, MoreHorizontal } from 'lucide-react';

interface ManualExpenseFormProps {
  activeUser: 'user_1' | 'user_2';
  onSave: (expense: Expense) => void;
}

const CATEGORIES: { label: ExpenseCategory; icon: any }[] = [
  { label: 'Makanan & Minuman', icon: Utensils },
  { label: 'Belanja Harian', icon: ShoppingBag },
  { label: 'Transportasi & Bensin', icon: Car },
  { label: 'Tagihan & Utilitas', icon: Receipt },
  { label: 'Hiburan & Hobi', icon: Gamepad2 },
  { label: 'Kesehatan', icon: HeartPulse },
  { label: 'Lainnya', icon: MoreHorizontal }
];

export const ManualExpenseForm: FC<ManualExpenseFormProps> = ({ activeUser, onSave }) => {
  const [title, setTitle] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Makanan & Minuman');
  const [date, setDate] = useState(getTodayDateString());
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, '');
    setRawAmount(val ? formatIDR(parseInt(val, 10)) : '');
    setError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseIDR(rawAmount);

    if (!title.trim() || amount <= 0) {
      setError('Mohon isi nama pengeluaran dan nominal dengan benar.');
      return;
    }

    const newExpense: Expense = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'exp-' + Date.now(),
      user_id: activeUser,
      title: title.trim(),
      amount,
      category,
      date,
      notes: notes.trim() || null,
      created_at: new Date().toISOString()
    };

    onSave(newExpense);

    setTitle('');
    setRawAmount('');
    setNotes('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
      <h3 className="text-base font-bold text-slate-800">✍️ Catat Pengeluaran Manual</h3>

      {error && (
        <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 border border-rose-100">
          {error}
        </div>
      )}

      {/* Nama Pengeluaran */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-600">Nama Pengeluaran / Toko</label>
        <input
          type="text"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="Contoh: Indomaret Kemang, Mie Ayam"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {/* Nominal */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-600">Nominal (Rp)</label>
        <input
          type="text"
          inputMode="numeric"
          value={rawAmount}
          onChange={handleAmountChange}
          placeholder="Nominal (Rp)"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base font-bold text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {/* Kategori Pills */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-slate-600">Kategori</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = category === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setCategory(cat.label)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tanggal */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-600">Tanggal Transaksi</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      {/* Catatan */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-600">Catatan (Opsional)</label>
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Tambahan keterangan bila perlu"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md active:bg-brand-700 transition"
      >
        <PlusCircle className="h-4 w-4" />
        Simpan Pengeluaran
      </button>
    </form>
  );
};

