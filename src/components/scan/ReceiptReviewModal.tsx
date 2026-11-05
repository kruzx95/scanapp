import { useState, FC } from 'react';
import { Expense, ExpenseCategory, GeminiReceiptResponse, ReceiptItem } from '../../types';
import { Check, X, Trash2, Plus, Store, Calendar, Tag } from 'lucide-react';

interface ReceiptReviewModalProps {
  activeUser: 'user_1' | 'user_2';
  initialData: GeminiReceiptResponse;
  imagePreviewUrl?: string;
  onSave: (expense: Expense) => void;
  onClose: () => void;
}

export const ReceiptReviewModal: FC<ReceiptReviewModalProps> = ({
  activeUser,
  initialData,
  imagePreviewUrl,
  onSave,
  onClose
}) => {
  const [merchantName, setMerchantName] = useState(initialData.merchantName || 'Struk Belanja');
  const [date, setDate] = useState(initialData.date);
  const [category, setCategory] = useState<ExpenseCategory>(
    (initialData.category as ExpenseCategory) || 'Belanja Harian'
  );
  const [items, setItems] = useState<ReceiptItem[]>(initialData.items || []);
  const [totalAmount, setTotalAmount] = useState<number>(initialData.totalAmount || 0);

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index);
    setItems(updated);
    const newTotal = updated.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    setTotalAmount(newTotal);
  };

  const handleAddItem = () => {
    setItems([...items, { name: 'Item Baru', quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index: number, field: keyof ReceiptItem, val: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = val;
    setItems(updated);
    const newTotal = updated.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    setTotalAmount(newTotal);
  };

  const handleSave = () => {
    const expense: Expense = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'exp-' + Date.now(),
      user_id: activeUser,
      title: merchantName.trim() || 'Struk Belanja',
      amount: totalAmount,
      category,
      date,
      receipt_items: items,
      created_at: new Date().toISOString()
    };
    onSave(expense);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-3 backdrop-blur-sm overflow-y-auto">
      <div className="my-auto w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">🔍 Hasil Scan AI - Siap Diedit</h3>
            <p className="text-xs text-slate-500">Periksa dan koreksi data sebelum disimpan</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 py-4 space-y-4">
          {imagePreviewUrl && (
            <div className="relative rounded-2xl overflow-hidden max-h-36 border border-slate-200">
              <img src={imagePreviewUrl} alt="Preview Struk" className="w-full object-cover" />
            </div>
          )}

          {/* Toko */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
              <Store className="h-3.5 w-3.5 text-brand-600" /> Nama Toko / Tempat
            </label>
            <input
              type="text"
              value={merchantName}
              onChange={e => setMerchantName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Tanggal & Kategori */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
                <Calendar className="h-3.5 w-3.5 text-brand-600" /> Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
                <Tag className="h-3.5 w-3.5 text-brand-600" /> Kategori
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
              >
                <option value="Belanja Harian">Belanja Harian</option>
                <option value="Makanan & Minuman">Makanan & Minuman</option>
                <option value="Transportasi & Bensin">Transportasi & Bensin</option>
                <option value="Tagihan & Utilitas">Tagihan & Utilitas</option>
                <option value="Hiburan & Hobi">Hiburan & Hobi</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Daftar Barang */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Rincian Barang Struk ({items.length})</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                <Plus className="h-3.5 w-3.5" /> Tambah Item
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto rounded-2xl bg-slate-50 p-2 border border-slate-100">
              {items.length === 0 ? (
                <p className="text-center py-3 text-xs text-slate-400">Tidak ada rincian item, isi total nominal langsung.</p>
              ) : (
                items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-xs border border-slate-100 text-xs">
                    <input
                      type="text"
                      value={it.name}
                      onChange={e => handleItemChange(idx, 'name', e.target.value)}
                      className="flex-1 font-medium text-slate-700 focus:outline-none"
                      placeholder="Nama Barang"
                    />
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                      className="w-10 text-center font-semibold bg-slate-50 rounded py-1 focus:outline-none"
                    />
                    <span className="text-slate-400">x</span>
                    <input
                      type="number"
                      value={it.price}
                      onChange={e => handleItemChange(idx, 'price', parseInt(e.target.value, 10) || 0)}
                      className="w-20 text-right font-bold text-slate-800 bg-slate-50 rounded py-1 px-1 focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Hapus item"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Total Nominal */}
          <div className="rounded-2xl bg-brand-50 p-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-brand-900">Total Nominal:</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-brand-600">Rp</span>
              <input
                type="number"
                value={totalAmount}
                onChange={e => setTotalAmount(parseInt(e.target.value, 10) || 0)}
                className="w-28 text-right text-base font-extrabold text-brand-700 bg-transparent focus:outline-none border-b border-brand-300"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-brand-600 py-3 text-xs font-bold text-white shadow-md active:bg-brand-700 transition"
          >
            <Check className="h-4 w-4" /> Simpan Pengeluaran
          </button>
        </div>
      </div>
    </div>
  );
};

