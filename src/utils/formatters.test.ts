import { describe, it, expect } from 'vitest';
import { formatIDR, parseIDR, formatDateIndo, getTodayDateString } from './formatters';

describe('formatters', () => {
  it('formats number to Indonesian Rupiah with thousands separator', () => {
    expect(formatIDR(0)).toBe('Rp 0');
    expect(formatIDR(15000)).toBe('Rp 15.000');
    expect(formatIDR(1250000)).toBe('Rp 1.250.000');
    expect(formatIDR(48500.75)).toBe('Rp 48.501');
  });

  it('parses raw or formatted IDR strings into clean numbers', () => {
    expect(parseIDR('Rp 15.000')).toBe(15000);
    expect(parseIDR('15000')).toBe(15000);
    expect(parseIDR('Rp 1.250.500')).toBe(1250500);
    expect(parseIDR('')).toBe(0);
    expect(parseIDR('abc')).toBe(0);
  });

  it('formats ISO date to human readable Indonesian date', () => {
    expect(formatDateIndo('2026-11-05')).toBe('5 November 2026');
    expect(formatDateIndo('2026-01-01')).toBe('1 Januari 2026');
    expect(formatDateIndo('invalid-date')).toBe('invalid-date');
  });

  it('returns today date string in YYYY-MM-DD format', () => {
    const today = getTodayDateString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

