import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isSupabaseConfigured, createExpenseLocallyOrCloud } from './supabase';
import { Expense } from '../types';
import * as storage from './storage';

describe('supabase service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('checks if supabase is configured', () => {
    expect(isSupabaseConfigured()).toBe(false);
    storage.setStoredSupabaseConfig('https://xyz.supabase.co', 'anon-key-123');
    expect(isSupabaseConfigured()).toBe(true);
  });

  it('saves to offline queue when supabase is not configured', async () => {
    const expense: Expense = {
      id: 'exp-1',
      user_id: 'user_1',
      title: 'Makan Bakso',
      amount: 25000,
      category: 'Makanan & Minuman',
      date: '2026-11-05',
      created_at: new Date().toISOString()
    };

    const result = await createExpenseLocallyOrCloud(expense);
    expect(result.synced).toBe(false);
    expect(storage.getOfflineQueue()).toHaveLength(1);
  });
});

