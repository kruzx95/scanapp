import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Integration', () => {
  it('renders navigation tabs and opens PIN modal when locked', () => {
    render(<App />);
    expect(screen.getByText('ScanApp')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /beranda/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /scan/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /manual/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /setelan/i })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/kunci akun/i));
    expect(screen.getByText('Buka Kunci Akun')).toBeInTheDocument();
  });
});

