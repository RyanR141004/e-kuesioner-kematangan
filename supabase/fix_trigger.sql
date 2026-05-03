-- =====================================================
-- Fix: Recreate trigger for auto-creating profiles
-- Jalankan ini di Supabase SQL Editor
-- =====================================================

-- Drop existing trigger & function if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate function
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

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify: check if trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
