import { describe, it, expect } from 'vitest';
import { parseGeminiReceiptJson } from './gemini';

describe('gemini service parser', () => {
  it('parses valid json directly', () => {
    const jsonString = JSON.stringify({
      merchantName: 'Indomaret Kemang',
      date: '2026-11-05',
      category: 'Belanja Harian',
      items: [
        { name: 'Susu UHT', quantity: 2, price: 18000 },
        { name: 'Roti Gandum', quantity: 1, price: 15000 }
      ],
      totalAmount: 33000
    });

    const parsed = parseGeminiReceiptJson(jsonString);
    expect(parsed.merchantName).toBe('Indomaret Kemang');
    expect(parsed.totalAmount).toBe(33000);
    expect(parsed.items).toHaveLength(2);
  });

  it('strips markdown code blocks (```json ... ```) before parsing', () => {
    const rawMarkdown = `\`\`\`json
    {
      "merchantName": "Alfamart",
      "date": "2026-11-04",
      "category": "Belanja Harian",
      "items": [],
      "totalAmount": 25000
    }
    \`\`\``;

    const parsed = parseGeminiReceiptJson(rawMarkdown);
    expect(parsed.merchantName).toBe('Alfamart');
    expect(parsed.totalAmount).toBe(25000);
  });

  it('provides safe fallbacks for missing or malformed fields', () => {
    const incompleteJson = '{"totalAmount": 50000}';
    const parsed = parseGeminiReceiptJson(incompleteJson);
    expect(parsed.merchantName).toBe('Struk Pembelian');
    expect(parsed.totalAmount).toBe(50000);
    expect(parsed.category).toBe('Belanja Harian');
    expect(parsed.items).toEqual([]);
  });

  it('throws a descriptive error on non-json text', () => {
    expect(() => parseGeminiReceiptJson('not a json at all')).toThrow('Gagal mengurai data struk');
  });
});

