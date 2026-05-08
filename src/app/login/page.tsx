'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { DAFTAR_KELEMBAGAAN } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [namaInstansi, setNamaInstansi] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'opd',
          nama_instansi: namaInstansi,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Auto sign in after registration
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError('Registrasi berhasil! Silakan login.');
      setIsRegister(false);
      setLoading(false);
      return;
    }

    // Fallback: create profile if trigger didn't fire
    const userId = loginData.user?.id;
    if (userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        email: email,
        full_name: fullName,
        role: 'opd',
        nama_instansi: namaInstansi,
      }, { onConflict: 'id' });
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">EK</div>
        <h1 className="login-title">
          {isRegister ? 'Daftar Akun' : 'Masuk'}
        </h1>
        <p className="login-subtitle">
          {isRegister
            ? 'Buat akun baru untuk mengisi kuesioner'
            : 'E-Kuesioner Evaluasi Kematangan SDM'}
        </p>

        {error && (
          <div style={{
            padding: '12px 16px', marginBottom: 20, borderRadius: 8,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Masukkan nama lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pilih Kelembagaan</label>
                <select
                  className="form-select"
                  value={namaInstansi}
                  onChange={(e) => setNamaInstansi(e.target.value)}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">-- Pilih Kelembagaan --</option>
                  {DAFTAR_KELEMBAGAAN.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="email@instansi.go.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            ) : isRegister ? 'Daftar' : 'Masuk'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              background: 'none', border: 'none', color: '#3b82f6',
              cursor: 'pointer', fontSize: 14,
            }}
          >
            {isRegister ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </button>
        </div>
      </div>
    </div>
  );
}
