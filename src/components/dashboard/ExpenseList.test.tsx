import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpenseList } from './ExpenseList';
import { Expense } from '../../types';

const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    user_id: 'user_1',
    title: 'Indomaret Point',
    amount: 35000,
    category: 'Belanja Harian',
    date: '2026-11-05',
    receipt_items: [
      { name: 'Kopi Kaleng', quantity: 1, price: 15000 },
      { name: 'Sandwich', quantity: 1, price: 20000 }
    ],
    created_at: '2026-11-05T10:00:00Z'
  }
];

describe('ExpenseList', () => {
  it('renders list of expenses with formatted rupiah and handles deletion', () => {
    const handleDelete = vi.fn();
    render(<ExpenseList expenses={mockExpenses} onDelete={handleDelete} />);

    expect(screen.getByText('Indomaret Point')).toBeInTheDocument();
    expect(screen.getByText('Rp 35.000')).toBeInTheDocument();
    expect(screen.getByText('Belanja Harian')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/lihat 2 barang struk/i));
    expect(screen.getByText('Kopi Kaleng')).toBeInTheDocument();
    expect(screen.getByText('Sandwich')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/hapus transaksi/i));
    expect(handleDelete).toHaveBeenCalledWith('exp-1');
  });

  it('renders empty state when no expenses exist', () => {
    render(<ExpenseList expenses={[]} onDelete={vi.fn()} />);
    expect(screen.getByText(/belum ada catatan pengeluaran/i)).toBeInTheDocument();
  });
});

