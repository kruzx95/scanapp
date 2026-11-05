export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export type ExpenseCategory =
  | 'Makanan & Minuman'
  | 'Belanja Harian'
  | 'Transportasi & Bensin'
  | 'Tagihan & Utilitas'
  | 'Hiburan & Hobi'
  | 'Kesehatan'
  | 'Lainnya';

export interface Expense {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  receipt_items?: ReceiptItem[] | null;
  notes?: string | null;
  created_at: string;
  synced?: boolean;
}

export interface UserProfile {
  id: 'user_1' | 'user_2';
  name: string;
  pin: string;
}

export interface GeminiReceiptResponse {
  merchantName: string;
  date: string;
  category: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  confidenceNotes?: string;
}

export type DateFilter = 'today' | 'week' | 'month' | 'all';

