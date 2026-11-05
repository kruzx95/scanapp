# 📱 ScanApp - Catat Pengeluaran Harian (PWA)

Aplikasi web mobile-first (Progressive Web App) untuk mencatat pengeluaran harian dengan fitur **Scan Struk AI (Gemini 2.5 Flash)** yang otomatis menghasilkan formulir yang langsung dapat diedit, **Input Manual Cepat**, serta **Isolasi 2 Pengguna (User 1 & User 2)** dengan proteksi 4-digit PIN.

---

## ✨ Fitur Utama

1. **📸 Cara 1: Scan Foto Struk (AI Vision OCR)**:
   - Ambil foto struk dari kamera HP atau unggah dari galeri.
   - AI Google Gemini Vision mendeteksi nama toko, tanggal transaksi, kategori, rincian barang, dan total harga.
   - Hasil deteksi langsung dimuat ke **Formulir Interaktif** yang bisa diedit (tambah/hapus barang, koreksi harga/toko) sebelum disimpan.
2. **✍️ Cara 2: Input Manual Cepat**:
   - Form cepat: nama pengeluaran, nominal (format otomatis Rupiah `Rp XX.XXX`), pilihan kategori instan 1-klik, dan tanggal.
3. **👥 Dukungan 2 Pengguna Terisolasi**:
   - Akun User 1 dan User 2 dengan data pengeluaran terpisah.
   - Dilindungi 4-digit PIN cepat (default `1234`, dapat diubah di menu Setelan).
   - Tombol cepat untuk mengunci akun atau berganti pengguna di header.
4. **📊 Dashboard & Ringkasan Keuangan**:
   - Total pengeluaran hari ini & bulan ini.
   - Filter cepat: *Hari Ini*, *7 Hari*, *Bulan Ini*, dan *Semua*.
   - Rincian struk belanja dapat di-expand/collapse.
5. **📴 Mode Offline & Ekspor Data**:
   - Jika internet terputus, data tersimpan di antrean lokal (`localStorage`) dan otomatis disinkronkan ke Supabase saat koneksi kembali.
   - Ekspor seluruh laporan pengeluaran ke format **Excel / CSV**.
6. **🚀 Siap Deploy ke GitHub Pages**:
   - Dilengkapi alur kerja GitHub Actions (`.github/workflows/deploy.yml`) untuk build dan deploy otomatis.

---

## 🛠️ Menjalankan Aplikasi Secara Lokal

### 1. Prasyarat
- Node.js versi 20+ sudah terpasang.

### 2. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada alamat yang ditampilkan (biasanya `http://localhost:5173`).

### 3. Menjalankan Pengujian Otomatis
```bash
npm run test:run
```

### 4. Melakukan Build Produksi
```bash
npm run build
```

---

## ⚙️ Konfigurasi Cloud (Supabase & Gemini API)

Aplikasi dapat langsung digunakan secara lokal / offline. Untuk mengaktifkan sinkronisasi cloud dan AI OCR:

### 1. Kunci API Google Gemini (Gratis)
1. Dapatkan kunci API gratis di [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Masukkan kunci API di menu **Setelan** pada aplikasi di smartphone/browser masing-masing.

### 2. Database Supabase (Opsional)
1. Buat proyek gratis di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor** di dashboard Supabase dan jalankan skrip berikut:

```sql
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_items JSONB DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date DESC);
```
3. Salin **Project URL** dan **Anon Public Key** dari menu *Project Settings -> API* di Supabase ke menu **Setelan** di dalam ScanApp.

---

## 🌐 Panduan Deploy ke GitHub Pages

1. Buat repository baru di GitHub (misal bernama `scanapp`).
2. Hubungkan repository lokal ini ke GitHub:
   ```bash
   git remote add origin https://github.com/<username-github-anda>/scanapp.git
   git push -u origin main
   ```
3. Di halaman GitHub repository Anda, buka tab **Settings -> Pages**:
   - Pada bagian **Build and deployment -> Source**, pilih **GitHub Actions**.
4. GitHub Actions akan otomatis melakukan build dan deploy. Aplikasi Anda akan aktif di:
   `https://<username-github-anda>.github.io/scanapp/`

