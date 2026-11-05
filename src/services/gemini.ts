import { GeminiReceiptResponse } from '../types';
import { getTodayDateString } from '../utils/formatters';

export function parseGeminiReceiptJson(rawText: string): GeminiReceiptResponse {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error('Gagal mengurai data struk dari AI. Gambar mungkin buram atau tidak berisi struk.');
  }

  const items = Array.isArray(parsed.items)
    ? parsed.items.map((it: any) => ({
        name: String(it.name || 'Barang'),
        quantity: Number(it.quantity) || 1,
        price: Number(it.price) || 0
      }))
    : [];

  return {
    merchantName: String(parsed.merchantName || 'Struk Pembelian'),
    date: parsed.date && parsed.date.match(/^\d{4}-\d{2}-\d{2}$/) ? parsed.date : getTodayDateString(),
    category: String(parsed.category || 'Belanja Harian'),
    items,
    totalAmount: Number(parsed.totalAmount) || items.reduce((acc: number, it: { price: number }) => acc + it.price, 0),
    confidenceNotes: parsed.confidenceNotes ? String(parsed.confidenceNotes) : undefined
  };
}

export const RECEIPT_SCHEMA_INSTRUCTION = `
Ekstrak rincian struk belanja ini ke dalam format JSON yang valid dan terstruktur persis seperti skema ini:
{
  "merchantName": "Nama Toko atau Tempat Makan",
  "date": "YYYY-MM-DD",
  "category": "Makanan & Minuman | Belanja Harian | Transportasi & Bensin | Tagihan & Utilitas | Hiburan & Hobi | Kesehatan | Lainnya",
  "items": [
    { "name": "Nama Produk", "quantity": 1, "price": 10000 }
  ],
  "totalAmount": 10000,
  "confidenceNotes": "Catatan singkat jika ada teks yang buram"
}
Jangan tambahkan teks pengantar apapun di luar JSON murni.
`;

export async function extractReceiptWithGemini(
  apiKey: string,
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<GeminiReceiptResponse> {
  if (!apiKey) {
    throw new Error('Kunci API Gemini belum diatur. Silakan masukkan di menu Setelan.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: RECEIPT_SCHEMA_INSTRUCTION
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: imageBase64
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      response_mime_type: 'application/json'
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gagal menghubungi Gemini API (Status ${response.status})`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('AI tidak mengembalikan respon teks dari gambar struk.');
  }

  return parseGeminiReceiptJson(rawText);
}

