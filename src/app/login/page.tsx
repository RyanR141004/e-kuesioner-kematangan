'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { DAFTAR_KELEMBAGAAN } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import LoginMascot from '@/components/LoginMascot';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [namaInstansi, setNamaInstansi] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  let typingTimeout: any;
  const handleEmailChange = (val: string) => {
    setEmail(val);
    setIsTyping(true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => setIsTyping(false), 300);
  };

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
    <div className="login-page-v2">
      {/* Animated background */}
      <div className="login-bg-shapes">
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
        <div className="bg-shape shape-3" />
        <div className="bg-shape shape-4" />
      </div>

      <motion.div
        className="login-container-v2"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Left side - Mascot */}
        <div className="login-mascot-side">
          <LoginMascot
            isEmailFocused={isEmailFocused}
            isPasswordFocused={isPasswordFocused}
            isTyping={isTyping}
            emailLength={email.length}
          />
          <motion.p
            className="mascot-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            E-Kuesioner Evaluasi<br />
            <span>Kematangan Perangkat Daerah</span>
          </motion.p>
        </div>

        {/* Right side - Form */}
        <div className="login-form-side">
          <motion.div
            key={isRegister ? 'register' : 'login'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="login-form-title">
              {isRegister ? 'Buat Akun Baru' : 'Selamat Datang! 👋'}
            </h1>
            <p className="login-form-subtitle">
              {isRegister
                ? 'Daftarkan instansi Anda untuk mengisi kuesioner evaluasi'
                : 'Masuk untuk mengakses sistem evaluasi kematangan'}
            </p>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="login-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  ❌ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={isRegister ? handleRegister : handleLogin}>
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="login-field">
                    <label>Nama Lengkap</label>
                    <div className="login-input-wrap">
                      <span className="login-input-icon">👤</span>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="login-field">
                    <label>Pilih Kelembagaan</label>
                    <div className="login-input-wrap">
                      <span className="login-input-icon">🏛️</span>
                      <select
                        value={namaInstansi}
                        onChange={(e) => setNamaInstansi(e.target.value)}
                        required
                      >
                        <option value="">-- Pilih Kelembagaan --</option>
                        {DAFTAR_KELEMBAGAAN.map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="login-field">
                <label>Email</label>
                <div className={`login-input-wrap ${isEmailFocused ? 'focused' : ''}`}>
                  <span className="login-input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="email@instansi.go.id"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label>Password</label>
                <div className={`login-input-wrap ${isPasswordFocused ? 'focused' : ''}`}>
                  <span className="login-input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                ) : isRegister ? '🚀 Daftar Sekarang' : '🔐 Masuk'}
              </motion.button>
            </form>

            <div className="login-switch">
              <button onClick={() => { setIsRegister(!isRegister); setError(''); }}>
                {isRegister ? '← Sudah punya akun? Masuk' : 'Belum punya akun? Daftar →'}
              </button>
            </div>

            <div className="login-footer-note">
              Permendagri No 99 Tahun 2018
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
