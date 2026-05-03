-- =====================================================
-- E-Kuesioner Evaluasi Tingkat Kematangan SDM & Organisasi
-- Database Schema & Seed Data
-- Permendagri No 99 Tahun 2018
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'opd' CHECK (role IN ('admin', 'operator', 'opd')),
  nama_instansi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. VARIABEL_EVALUASI TABLE (11 Instrumen Wajib)
-- =====================================================
CREATE TABLE IF NOT EXISTS variabel_evaluasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_variabel TEXT NOT NULL,
  deskripsi TEXT,
  urutan INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. TRANSAKSI_EVALUASI TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS transaksi_evaluasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opd_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  periode_tahun INT NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  jenis_evaluasi TEXT NOT NULL DEFAULT 'Evaluasi Manajemen SDM',
  tanggal_submit TIMESTAMPTZ DEFAULT NOW(),
  total_skor DECIMAL(4,2),
  level_kematangan TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'reviewed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. DETAIL_JAWABAN TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS detail_jawaban (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaksi_id UUID NOT NULL REFERENCES transaksi_evaluasi(id) ON DELETE CASCADE,
  variabel_id UUID NOT NULL REFERENCES variabel_evaluasi(id) ON DELETE CASCADE,
  tingkat_capaian INT NOT NULL CHECK (tingkat_capaian BETWEEN 1 AND 5),
  link_drive_dukung TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. SEED DATA: 11 Variabel Instrumen Wajib
-- =====================================================
INSERT INTO variabel_evaluasi (nama_variabel, deskripsi, urutan) VALUES
  ('Perencanaan Pembangunan Daerah', 'Evaluasi perencanaan pembangunan daerah yang terintegrasi dan berkelanjutan', 1),
  ('Keuangan Daerah', 'Evaluasi pengelolaan keuangan daerah yang transparan dan akuntabel', 2),
  ('Pengawasan Penyelenggaraan Pemerintahan Daerah', 'Evaluasi sistem pengawasan internal dan eksternal pemerintahan daerah', 3),
  ('Perencanaan SDM', 'Evaluasi perencanaan kebutuhan dan pengembangan SDM aparatur', 4),
  ('Pengembangan SDM', 'Evaluasi program pengembangan kompetensi dan kapasitas SDM', 5),
  ('Penilaian Kinerja', 'Evaluasi sistem penilaian kinerja individu dan organisasi', 6),
  ('Sistem Informasi SDM', 'Evaluasi sistem informasi manajemen kepegawaian', 7),
  ('Budaya Kerja', 'Evaluasi budaya kerja dan nilai-nilai organisasi', 8),
  ('Penjaminan Mutu', 'Evaluasi sistem penjaminan mutu layanan dan proses', 9),
  ('Kelembagaan', 'Evaluasi struktur dan tata kelola kelembagaan', 10),
  ('Tatalaksana', 'Evaluasi prosedur operasional dan tata laksana organisasi', 11);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE variabel_evaluasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi_evaluasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE detail_jawaban ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- VARIABEL_EVALUASI policies (read-only for all authenticated)
CREATE POLICY "Anyone authenticated can read variabel" ON variabel_evaluasi
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage variabel" ON variabel_evaluasi
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- TRANSAKSI_EVALUASI policies
CREATE POLICY "OPD can insert own transaksi" ON transaksi_evaluasi
  FOR INSERT WITH CHECK (auth.uid() = opd_id);

CREATE POLICY "OPD can view own transaksi" ON transaksi_evaluasi
  FOR SELECT USING (
    auth.uid() = opd_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'operator'))
  );

CREATE POLICY "Admin can manage all transaksi" ON transaksi_evaluasi
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- DETAIL_JAWABAN policies
CREATE POLICY "OPD can insert own detail" ON detail_jawaban
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM transaksi_evaluasi 
      WHERE id = transaksi_id AND opd_id = auth.uid()
    )
  );

CREATE POLICY "OPD can view own detail" ON detail_jawaban
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM transaksi_evaluasi 
      WHERE id = transaksi_id AND (
        opd_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'operator'))
      )
    )
  );

CREATE POLICY "Admin can manage all detail" ON detail_jawaban
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- 7. FUNCTION: Auto-create profile on signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, nama_instansi)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'opd'),
    COALESCE(NEW.raw_user_meta_data->>'nama_instansi', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 8. INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_transaksi_opd ON transaksi_evaluasi(opd_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_periode ON transaksi_evaluasi(periode_tahun);
CREATE INDEX IF NOT EXISTS idx_detail_transaksi ON detail_jawaban(transaksi_id);
CREATE INDEX IF NOT EXISTS idx_detail_variabel ON detail_jawaban(variabel_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
