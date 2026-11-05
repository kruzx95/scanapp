import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Expense } from '../types';
import { getStoredSupabaseConfig, getOfflineQueue, enqueueOfflineExpense, clearOfflineQueue } from './storage';

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function isSupabaseConfigured(): boolean {
  const { url, key } = getStoredSupabaseConfig();
  return Boolean(url && key);
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getStoredSupabaseConfig();
  if (!url || !key) return null;

  if (cachedClient && lastUrl === url && lastKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key);
    lastUrl = url;
    lastKey = key;
    return cachedClient;
  } catch {
    return null;
  }
}

export async function fetchExpensesFromCloud(userId: string): Promise<Expense[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data, error } = await client
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.warn('Supabase fetch error:', error.message);
    return [];
  }

  return (data || []).map((row: any) => ({
    ...row,
    synced: true
  }));
}

export async function createExpenseLocallyOrCloud(expense: Expense): Promise<Expense> {
  const client = getSupabaseClient();

  if (!client || !navigator.onLine) {
    enqueueOfflineExpense(expense);
    return { ...expense, synced: false };
  }

  try {
    const { error } = await client.from('expenses').insert([
      {
        id: expense.id,
        user_id: expense.user_id,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        receipt_items: expense.receipt_items || null,
        notes: expense.notes || null,
        created_at: expense.created_at
      }
    ]);

    if (error) {
      console.warn('Supabase insert failed, saving to offline queue:', error.message);
      enqueueOfflineExpense(expense);
      return { ...expense, synced: false };
    }

    return { ...expense, synced: true };
  } catch {
    enqueueOfflineExpense(expense);
    return { ...expense, synced: false };
  }
}

export async function deleteExpenseFromCloud(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return true;

  const { error } = await client.from('expenses').delete().eq('id', id);
  return !error;
}

export async function syncOfflineQueueToCloud(): Promise<number> {
  const client = getSupabaseClient();
  if (!client || !navigator.onLine) return 0;

  const queue = getOfflineQueue();
  if (queue.length === 0) return 0;

  let successCount = 0;
  const remaining: Expense[] = [];

  for (const item of queue) {
    const { error } = await client.from('expenses').upsert([
      {
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        amount: item.amount,
        category: item.category,
        date: item.date,
        receipt_items: item.receipt_items || null,
        notes: item.notes || null,
        created_at: item.created_at
      }
    ]);

    if (!error) {
      successCount++;
    } else {
      remaining.push(item);
    }
  }

  if (remaining.length === 0) {
    clearOfflineQueue();
  } else {
    localStorage.setItem('scanapp_offline_queue', JSON.stringify(remaining));
  }

  return successCount;
}

