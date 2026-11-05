import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReceiptReviewModal } from './ReceiptReviewModal';
import { GeminiReceiptResponse } from '../../types';

const mockExtraction: GeminiReceiptResponse = {
  merchantName: 'Indomaret Hayam Wuruk',
  date: '2026-11-05',
  category: 'Belanja Harian',
  items: [
    { name: 'Air Mineral 600ml', quantity: 2, price: 6000 },
    { name: 'Roti Cokelat', quantity: 1, price: 12000 }
  ],
  totalAmount: 18000
};

describe('ReceiptReviewModal', () => {
  it('renders extracted details and allows direct editing before saving', () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <ReceiptReviewModal
        activeUser="user_1"
        initialData={mockExtraction}
        imagePreviewUrl="data:image/jpeg;base64,test"
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    expect(screen.getByDisplayValue('Indomaret Hayam Wuruk')).toBeInTheDocument();
    expect(screen.getByDisplayValue('18000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Air Mineral 600ml')).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('Indomaret Hayam Wuruk'), {
      target: { value: 'Indomaret Point' }
    });

    fireEvent.click(screen.getByRole('button', { name: /simpan pengeluaran/i }));

    expect(handleSave).toHaveBeenCalledTimes(1);
    const saved = handleSave.mock.calls[0][0];
    expect(saved.title).toBe('Indomaret Point');
    expect(saved.amount).toBe(18000);
    expect(saved.receipt_items).toHaveLength(2);
  });

  it('allows removing an item from the receipt items list', () => {
    render(
      <ReceiptReviewModal
        activeUser="user_1"
        initialData={mockExtraction}
        imagePreviewUrl=""
        onSave={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const deleteButtons = screen.getAllByLabelText(/hapus item/i);
    expect(deleteButtons).toHaveLength(2);
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByDisplayValue('Air Mineral 600ml')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Roti Cokelat')).toBeInTheDocument();
  });
});

