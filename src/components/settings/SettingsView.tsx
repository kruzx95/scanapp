import { useState, FC } from 'react';
import { Key, Database, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import {
  getStoredApiKey,
  setStoredApiKey,
  getStoredPin,
  setStoredPin,
  getStoredSupabaseConfig,
  setStoredSupabaseConfig
} from '../../services/storage';
import { Expense } from '../../types';
import { downloadCsvFile } from '../../utils/exportCsv';

interface SettingsViewProps {
  activeUser: 'user_1' | 'user_2';
  expenses: Expense[];
}

export const SettingsView: FC<SettingsViewProps> = ({ activeUser, expenses }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [pin, setPin] = useState(getStoredPin(activeUser));
  const [supaConfig, setSupaConfig] = useState(getStoredSupabaseConfig());
  const [savedMessage, setSavedMessage] = useState('');

  const handleSaveSettings = () => {
    setStoredApiKey(apiKey);
    setStoredPin(activeUser, pin);
    setStoredSupabaseConfig(supaConfig.url, supaConfig.key);
    setSavedMessage('Pengaturan berhasil disimpan!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="space-y-5 rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
      <h3 className="text-base font-bold text-slate-800">⚙️ Setelan Aplikasi</h3>

      {savedMessage && (
        <div className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 border border-emerald-100">
          {savedMessage}
        </div>
      )}

      {/* Gemini API Key */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Key className="h-3.5 w-3.5 text-brand-600" /> Google Gemini API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="AIzaSy..."
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono focus:border-brand-500 focus:outline-none"
        />
        <p className="text-[11px] text-slate-400">
          Dibutuhkan untuk OCR struk belanjaan.{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 font-bold inline-flex items-center gap-0.5 hover:underline"
          >
            Dapatkan Key Gratis di Google AI Studio <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>

      {/* PIN User */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> PIN 4-Digit ({activeUser === 'user_1' ? 'User 1' : 'User 2'})
        </label>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={e => setPin(e.target.value.replace(/[^\d]/g, ''))}
          className="w-32 rounded-xl border border-slate-200 px-3.5 py-2 text-center text-base font-bold tracking-widest focus:border-brand-500 focus:outline-none"
        />
      </div>

      {/* Supabase Config */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Database className="h-3.5 w-3.5 text-brand-600" /> Supabase Cloud Database (Opsional)
        </label>
        <input
          type="text"
          value={supaConfig.url}
          onChange={e => setSupaConfig({ ...supaConfig, url: e.target.value })}
          placeholder="https://xyz.supabase.co"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono focus:border-brand-500 focus:outline-none"
        />
        <input
          type="password"
          value={supaConfig.key}
          onChange={e => setSupaConfig({ ...supaConfig, key: e.target.value })}
          placeholder="Supabase Anon Public Key"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono focus:border-brand-500 focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={handleSaveSettings}
        className="w-full rounded-2xl bg-brand-600 py-3 text-xs font-bold text-white shadow-md active:bg-brand-700 transition"
      >
        Simpan Semua Perubahan
      </button>

      {/* Export CSV */}
      <div className="pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => downloadCsvFile(expenses, `pengeluaran_${activeUser}.csv`)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
        >
          <Download className="h-4 w-4" /> Download Laporan ke Excel / CSV
        </button>
      </div>
    </div>
  );
};

