import { useState, useRef, FC, ChangeEvent } from 'react';
import { Camera, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { extractReceiptWithGemini } from '../../services/gemini';
import { getStoredApiKey } from '../../services/storage';
import { GeminiReceiptResponse, Expense } from '../../types';
import { ReceiptReviewModal } from './ReceiptReviewModal';

interface ReceiptScannerProps {
  activeUser: 'user_1' | 'user_2';
  onSaveExpense: (expense: Expense) => void;
  onOpenSettings: () => void;
}

export const ReceiptScanner: FC<ReceiptScannerProps> = ({
  activeUser,
  onSaveExpense,
  onOpenSettings
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<GeminiReceiptResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = getStoredApiKey();
    if (!apiKey) {
      setError('Gemini API Key belum dimasukkan. Silakan buka tab Setelan untuk memasukkan API Key gratis.');
      return;
    }

    setError('');
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fullBase64 = reader.result as string;
        setPreviewUrl(fullBase64);
        const base64Data = fullBase64.split(',')[1];

        const result = await extractReceiptWithGemini(apiKey, base64Data, file.type || 'image/jpeg');
        setExtractedData(result);
      } catch (err: any) {
        setError(err.message || 'Gagal memproses struk.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 rounded-3xl bg-white p-6 text-center shadow-sm border border-slate-100">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Camera className="h-8 w-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-800">📸 Foto & Scan Struk Belanja</h3>
      <p className="text-xs text-slate-500 max-w-xs mx-auto">
        AI Gemini otomatis mendeteksi nama toko, tanggal, item barang, dan total nominal ke form yang bisa langsung diedit.
      </p>

      {error && (
        <div className="rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-600 border border-rose-100 text-left flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{error}</p>
            {error.includes('Setelan') && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="mt-2 inline-block rounded-lg bg-rose-600 px-3 py-1.5 text-white font-bold"
              >
                Buka Setelan Sekarang
              </button>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col gap-2 pt-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-600 py-4 text-sm font-bold text-white shadow-md active:bg-brand-700 disabled:opacity-50 transition"
        >
          {loading ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin" />
              <span>Membaca Struk dengan AI...</span>
            </>
          ) : (
            <>
              <Camera className="h-5 w-5" />
              <span>Ambil Foto Struk</span>
            </>
          )}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.removeAttribute('capture');
              fileInputRef.current.click();
            }
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
        >
          <Upload className="h-4 w-4" />
          <span>Upload dari Galeri Foto</span>
        </button>
      </div>

      {extractedData && (
        <ReceiptReviewModal
          activeUser={activeUser}
          initialData={extractedData}
          imagePreviewUrl={previewUrl || undefined}
          onSave={expense => {
            onSaveExpense(expense);
            setExtractedData(null);
            setPreviewUrl(null);
          }}
          onClose={() => {
            setExtractedData(null);
            setPreviewUrl(null);
          }}
        />
      )}
    </div>
  );
};

