# 🏛️ E-Kuesioner Evaluasi Tingkat Kematangan SDM & Organisasi

Sistem E-Kuesioner untuk evaluasi tingkat kematangan SDM & Organisasi Perangkat Daerah berdasarkan **Permendagri No 99 Tahun 2018**.

## 🚀 Tech Stack
- **Next.js 14** (App Router)
- **Supabase** (PostgreSQL + Auth + RLS)
- **React Hook Form** + Zod Validation
- **Recharts** (Charts & Graphs)
- **XLSX** (Excel Export)
- **Vercel** (Deployment)

## 📦 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase
1. Buat project baru di [supabase.com](https://supabase.com)
2. Copy file `.env.local.example` ke `.env.local`
3. Isi dengan credentials dari Supabase Dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 3. Setup Database
1. Buka **SQL Editor** di Supabase Dashboard
2. Jalankan file `supabase/migration.sql`
3. Ini akan membuat:
   - Tabel `profiles`, `variabel_evaluasi`, `transaksi_evaluasi`, `detail_jawaban`
   - Seed 11 variabel instrumen wajib
   - RLS policies untuk keamanan data
   - Trigger auto-create profile saat user signup

### 4. Setup Admin User
Setelah mendaftar user pertama, ubah role-nya menjadi `admin` di Supabase:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@yourdomain.com';
```

### 5. Run Development
```bash
npm run dev
```
Buka http://localhost:3000

## 🌐 Deploy ke Vercel
1. Push ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan Environment Variables (sama seperti `.env.local`)
4. Deploy!

## 📋 Fitur
- ✅ **Auth & RLS** — Role-based access (Admin, Operator, OPD)
- ✅ **11 Variabel Evaluasi** — Sesuai Permendagri No 99/2018
- ✅ **Form Kuesioner Dinamis** — Conditional URL input untuk Data Dukung
- ✅ **Engine Perhitungan** — Scoring otomatis & mapping level kematangan
- ✅ **Dashboard Analitik** — Charts, ranking, statistik
- ✅ **Detail Jawaban** — Tombol "Lihat Bukti" untuk buka Google Drive
- ✅ **Export Excel** — Download data ke format .xlsx

## 📊 Level Kematangan
| Skor | Level | Label |
|------|-------|-------|
| 0 – 1.5 | Level 1 | Initial |
| 1.6 – 2.5 | Level 2 | Developing |
| 2.6 – 3.5 | Level 3 | Defined |
| 3.6 – 4.5 | Level 4 | Managed |
| 4.6 – 5.0 | Level 5 | Optimized |
