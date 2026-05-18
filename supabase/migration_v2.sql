-- =====================================================
-- REVISI: Normalisasi database + 29 Kelembagaan
-- Jalankan di Supabase SQL Editor
-- =====================================================

-- 1. Update tabel kelembagaan: hapus data lama, insert 29 entitas
DELETE FROM kelembagaan;

INSERT INTO kelembagaan (nama, urutan) VALUES
('Sekretariat Daerah', 1),
('Badan Pendapatan Daerah', 2),
('Dinas Komunikasi dan Informatika', 3),
('Badan Perencanaan Pembangunan Daerah', 4),
('Dinas Lingkungan Hidup', 5),
('Dinas Tenaga Kerja, Penanaman Modal dan Pelayanan Terpadu Satu Pintu', 6),
('Dinas Perpustakaan Umum dan Arsip Daerah', 7),
('Dinas Kependudukan dan Pencatatan Sipil', 8),
('Satuan Polisi Pamong Praja', 9),
('Badan Kepegawaian dan Pengembangan SDM', 10),
('Dinas Kepemudaan, Olahraga, dan Pariwisata', 11),
('Dinas Kesehatan', 12),
('Dinas Perhubungan', 13),
('Dinas Koperasi, Perindustrian, dan Perdagangan', 14),
('Sekretariat DPRD', 15),
('Dinas Pekerjaan Umum, Penataan Ruang, Perumahan, dan Kawasan Permukiman', 16),
('Inspektorat Daerah', 17),
('Dinas Pendidikan dan Kebudayaan', 18),
('Dinas Ketahanan Pangan dan Pertanian', 19),
('Badan Keuangan dan Aset Daerah', 20),
('Kecamatan Klojen', 21),
('Kecamatan Kedungkandang', 22),
('Kecamatan Sukun', 23),
('Badan Kesatuan Bangsa dan Politik', 24),
('Dinas Sosial, Pemberdayaan Perempuan, Perlindungan Anak, Pengendalian Penduduk dan KB', 25),
('Kecamatan Blimbing', 26),
('Kecamatan Lowokwaru', 27),
('Bagian Hukum', 28)
ON CONFLICT (nama) DO NOTHING;

-- 2. Tambah kolom kelembagaan_id ke transaksi_evaluasi
ALTER TABLE transaksi_evaluasi ADD COLUMN IF NOT EXISTS kelembagaan_id UUID REFERENCES kelembagaan(id);

-- 3. Hapus kolom jenis_evaluasi (sudah tidak diperlukan)
ALTER TABLE transaksi_evaluasi DROP COLUMN IF EXISTS jenis_evaluasi;

-- 4. RLS policy untuk kelembagaan (jika belum ada)
DROP POLICY IF EXISTS "Authenticated can read kelembagaan" ON kelembagaan;
CREATE POLICY "Authenticated can read kelembagaan" ON kelembagaan
  FOR SELECT USING (auth.role() = 'authenticated');

-- 5. Verifikasi: cek jumlah kelembagaan
SELECT COUNT(*) AS total_kelembagaan FROM kelembagaan;
