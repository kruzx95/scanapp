import { Expense } from '../types';

const STORAGE_KEYS = {
  GEMINI_API_KEY: 'scanapp_gemini_api_key',
  ACTIVE_USER: 'scanapp_active_user',
  PIN_PREFIX: 'scanapp_pin_',
  OFFLINE_QUEUE: 'scanapp_offline_queue',
  SUPABASE_URL: 'scanapp_supabase_url',
  SUPABASE_KEY: 'scanapp_supabase_key'
};

export function getStoredApiKey(): string {
  return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key.trim());
}

export function getActiveUser(): 'user_1' | 'user_2' {
  const u = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
  return u === 'user_2' ? 'user_2' : 'user_1';
}

export function setActiveUser(user: 'user_1' | 'user_2'): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, user);
}

export function getStoredPin(user: 'user_1' | 'user_2'): string {
  return localStorage.getItem(STORAGE_KEYS.PIN_PREFIX + user) || '1234';
}

export function setStoredPin(user: 'user_1' | 'user_2', pin: string): void {
  localStorage.setItem(STORAGE_KEYS.PIN_PREFIX + user, pin);
}

export function getOfflineQueue(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function enqueueOfflineExpense(expense: Expense): void {
  const queue = getOfflineQueue();
  queue.push({ ...expense, synced: false });
  localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
}

export function clearOfflineQueue(): void {
  localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
}

export function getStoredSupabaseConfig(): { url: string; key: string } {
  return {
    url: localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '',
    key: localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || ''
  };
}

export function setStoredSupabaseConfig(url: string, key: string): void {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
  localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, key.trim());
}

