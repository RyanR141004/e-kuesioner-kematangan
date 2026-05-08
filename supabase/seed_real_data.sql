-- =====================================================
-- UPDATE: Real data seeding
-- Jalankan di Supabase SQL Editor
-- =====================================================

-- 1. Tambah kolom link_petunjuk ke variabel_evaluasi
ALTER TABLE variabel_evaluasi ADD COLUMN IF NOT EXISTS link_petunjuk TEXT;

-- 2. Hapus data variabel lama & insert data real
DELETE FROM detail_jawaban;
DELETE FROM transaksi_evaluasi;
DELETE FROM variabel_evaluasi;

INSERT INTO variabel_evaluasi (nama_variabel, deskripsi, urutan, link_petunjuk) VALUES
('Bagaimana cara penentuan kegiatan yang diprioritaskan dalam perencanaan tahunan?', 'Perencanaan dan penentuan prioritas kegiatan tahunan', 1, 'https://drive.google.com/drive/folders/1zBT-bbXPy14tW7NHKI-w4j-DTlLAWL7N?usp=sharing'),
('Bagaimana metode pengendalian program kegiatan dilakukan di perangkat daerah?', 'Pengendalian dan monitoring program kegiatan', 2, 'https://drive.google.com/drive/folders/1SqyrgktMRziL9fSUCveR10vZdQQPIHue?usp=sharing'),
('Bagaimana proses penjaminan mutu dilakukan di perangkat daerah?', 'Sistem penjaminan mutu layanan dan proses', 3, 'https://drive.google.com/drive/folders/1EqlQzuuYLnoFPYeKccJ46juJooOAvI5F?usp=sharing'),
('Sejauh mana pengelolaan SOP di perangkat daerah anda?', 'Pengelolaan Standard Operating Procedure', 4, 'https://drive.google.com/drive/folders/1lquyRnkB6YRtbLZaYElv9iys504UNZmd?usp=sharing'),
('Bagaimana rencana pengembangan kompetensi pegawai di perangkat daerah anda?', 'Pengembangan kompetensi dan kapasitas SDM', 5, 'https://drive.google.com/drive/folders/1T9fimaeggxgKA5q_Mj2BCwsf5kQPFEoo?usp=sharing'),
('Bagaimana proses analisis kebijakan di perangkat daerah Anda?', 'Analisis dan evaluasi kebijakan organisasi', 6, 'https://drive.google.com/drive/folders/1rlnPKFG_bwR_pQ4HMkVAdbNnjMO1d3OB?usp=sharing'),
('Bagaimana pengelolaan sumber daya dalam pelaksanaan proyek di perangkat daerah anda?', 'Pengelolaan sumber daya proyek', 7, 'https://drive.google.com/drive/folders/1b7XGQhyS9t_vBNQlHZpfnJPnh9ceIc95?usp=sharing'),
('Bagaimana pengelolaan risiko dalam tugas perangkat daerah Anda?', 'Manajemen risiko organisasi', 8, 'https://drive.google.com/drive/folders/1D08sAaS31MVTStR8p6OMRB2rgxTTAcKY?usp=sharing'),
('Bagaimana pengukuran kinerja di perangkat daerah Anda?', 'Sistem pengukuran dan evaluasi kinerja', 9, 'https://drive.google.com/drive/folders/1rBJbdvII807-Fs9cvo71DOYOi4mC1Kbf?usp=sharing'),
('Bagaimana perangkat daerah Anda mengembangkan inovasi?', 'Pengembangan inovasi pelayanan publik', 10, 'https://drive.google.com/drive/folders/14NcO4U9TiImABrc2xPABMWnEng3SswPu?usp=sharing'),
('Bagaimana penerapan budaya organisasi di perangkat daerah Anda?', 'Budaya dan nilai-nilai organisasi', 11, 'https://drive.google.com/drive/folders/1vqsQUXmrGa0hYwI6flIHXNeGG2y0NPo0?usp=sharing');

-- 3. Buat tabel daftar kelembagaan
CREATE TABLE IF NOT EXISTS kelembagaan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama TEXT NOT NULL UNIQUE,
  urutan INT NOT NULL
);

ALTER TABLE kelembagaan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read kelembagaan" ON kelembagaan
  FOR SELECT USING (auth.role() = 'authenticated');

-- Seed 26 Kelembagaan
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
('Kecamatan Blimbing', 26)
ON CONFLICT (nama) DO NOTHING;
