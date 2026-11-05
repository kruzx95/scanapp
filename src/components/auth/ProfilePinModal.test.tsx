import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfilePinModal } from './ProfilePinModal';

describe('ProfilePinModal', () => {
  it('renders user switcher and 4-digit PIN input pad', () => {
    render(<ProfilePinModal activeUser="user_1" onUnlock={vi.fn()} onSwitchUser={vi.fn()} />);
    expect(screen.getByText('Buka Kunci Akun')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /User 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /User 2/i })).toBeInTheDocument();
  });

  it('triggers onUnlock when correct PIN (1234) is entered', () => {
    const handleUnlock = vi.fn();
    render(<ProfilePinModal activeUser="user_1" onUnlock={handleUnlock} onSwitchUser={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '4' }));

    expect(handleUnlock).toHaveBeenCalledTimes(1);
  });

  it('shows error message when incorrect PIN is entered', () => {
    const handleUnlock = vi.fn();
    render(<ProfilePinModal activeUser="user_1" onUnlock={handleUnlock} onSwitchUser={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '9' }));
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    fireEvent.click(screen.getByRole('button', { name: '9' }));

    expect(handleUnlock).not.toHaveBeenCalled();
    expect(screen.getByText(/PIN salah/i)).toBeInTheDocument();
  });
});

