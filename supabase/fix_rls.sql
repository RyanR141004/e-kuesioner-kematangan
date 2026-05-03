-- =====================================================
-- Fix: Simplify RLS policies to avoid circular reference
-- Jalankan ini di Supabase SQL Editor
-- =====================================================

-- Drop ALL existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;

-- Simplified policies (no circular reference)
-- All authenticated users can read all profiles (names & roles are not sensitive)
CREATE POLICY "Authenticated can read profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Also simplify transaksi policies
DROP POLICY IF EXISTS "Admin can manage all transaksi" ON transaksi_evaluasi;
DROP POLICY IF EXISTS "OPD can view own transaksi" ON transaksi_evaluasi;
DROP POLICY IF EXISTS "OPD can insert own transaksi" ON transaksi_evaluasi;

CREATE POLICY "Authenticated can read transaksi" ON transaksi_evaluasi
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own transaksi" ON transaksi_evaluasi
  FOR INSERT WITH CHECK (auth.uid() = opd_id);

-- Simplify detail_jawaban policies
DROP POLICY IF EXISTS "Admin can manage all detail" ON detail_jawaban;
DROP POLICY IF EXISTS "OPD can view own detail" ON detail_jawaban;
DROP POLICY IF EXISTS "OPD can insert own detail" ON detail_jawaban;

CREATE POLICY "Authenticated can read detail" ON detail_jawaban
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert detail" ON detail_jawaban
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM transaksi_evaluasi 
      WHERE id = transaksi_id AND opd_id = auth.uid()
    )
  );

-- Simplify variabel policies
DROP POLICY IF EXISTS "Anyone authenticated can read variabel" ON variabel_evaluasi;
DROP POLICY IF EXISTS "Admin can manage variabel" ON variabel_evaluasi;

CREATE POLICY "Authenticated can read variabel" ON variabel_evaluasi
  FOR SELECT USING (auth.role() = 'authenticated');
