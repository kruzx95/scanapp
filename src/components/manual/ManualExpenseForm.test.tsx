import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ManualExpenseForm } from './ManualExpenseForm';

describe('ManualExpenseForm', () => {
  it('renders all form fields and submits valid expense', () => {
    const handleSave = vi.fn();
    render(<ManualExpenseForm activeUser="user_1" onSave={handleSave} />);

    expect(screen.getByPlaceholderText(/contoh: indomaret/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nominal/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/contoh: indomaret/i), {
      target: { value: 'Kopi Kenangan' }
    });
    fireEvent.change(screen.getByPlaceholderText(/nominal/i), {
      target: { value: '25000' }
    });

    fireEvent.click(screen.getByRole('button', { name: /simpan pengeluaran/i }));

    expect(handleSave).toHaveBeenCalledTimes(1);
    const savedExpense = handleSave.mock.calls[0][0];
    expect(savedExpense.title).toBe('Kopi Kenangan');
    expect(savedExpense.amount).toBe(25000);
    expect(savedExpense.user_id).toBe('user_1');
  });

  it('prevents submission when title or amount is missing', () => {
    const handleSave = vi.fn();
    render(<ManualExpenseForm activeUser="user_1" onSave={handleSave} />);

    fireEvent.click(screen.getByRole('button', { name: /simpan pengeluaran/i }));
    expect(handleSave).not.toHaveBeenCalled();
    expect(screen.getByText(/mohon isi nama pengeluaran dan nominal/i)).toBeInTheDocument();
  });
});

