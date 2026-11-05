import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredApiKey,
  setStoredApiKey,
  getActiveUser,
  setActiveUser,
  getStoredPin,
  setStoredPin,
  getOfflineQueue,
  enqueueOfflineExpense,
  clearOfflineQueue
} from './storage';
import { Expense } from '../types';

describe('storage service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves Gemini API Key', () => {
    expect(getStoredApiKey()).toBe('');
    setStoredApiKey('AIzaSyTestKey123');
    expect(getStoredApiKey()).toBe('AIzaSyTestKey123');
  });

  it('manages active user ID and PIN per user', () => {
    expect(getActiveUser()).toBe('user_1');
    setActiveUser('user_2');
    expect(getActiveUser()).toBe('user_2');

    expect(getStoredPin('user_1')).toBe('1234');
    setStoredPin('user_1', '5678');
    expect(getStoredPin('user_1')).toBe('5678');
    expect(getStoredPin('user_2')).toBe('1234');
  });

  it('enqueues and clears offline expenses queue', () => {
    expect(getOfflineQueue()).toEqual([]);
    const item: Expense = {
      id: 'offline-1',
      user_id: 'user_1',
      title: 'Makan Offline',
      amount: 20000,
      category: 'Makanan & Minuman',
      date: '2026-11-05',
      created_at: new Date().toISOString()
    };
    enqueueOfflineExpense(item);
    expect(getOfflineQueue()).toHaveLength(1);
    expect(getOfflineQueue()[0].id).toBe('offline-1');

    clearOfflineQueue();
    expect(getOfflineQueue()).toEqual([]);
  });
});

