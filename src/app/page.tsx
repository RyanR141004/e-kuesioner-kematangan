'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="landing-page">
      {/* Animated gradient background layers */}
      <div className="landing-bg">
        <div className="landing-orb orb-1" />
        <div className="landing-orb orb-2" />
        <div className="landing-orb orb-3" />
        <div className="landing-grid-overlay" />
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 740, padding: '0 20px' }}>
        {/* Logo */}
        <motion.div
          className="landing-logo"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        >
          EK
        </motion.div>

        <motion.h1
          className="landing-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          E-Kuesioner Evaluasi<br />
          <span className="landing-title-accent">Kematangan Perangkat Daerah</span>
        </motion.h1>

        <motion.p
          className="landing-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Sistem evaluasi mandiri (self-assessment) tingkat kematangan 29 Perangkat Daerah
          berdasarkan <strong style={{ color: '#e2e8f0' }}>Permendagri No 99 Tahun 2018</strong>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/login" className="landing-cta">
            <span>Masuk ke Sistem</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          className="landing-badges"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            { icon: '📋', label: '11 Instrumen' },
            { icon: '🏛️', label: '29 Kelembagaan' },
            { icon: '🏆', label: 'Ranking Otomatis' },
            { icon: '📄', label: 'Export PDF & Excel' },
          ].map((f, i) => (
            <motion.div
              key={f.label}
              className="landing-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="badge-icon">{f.icon}</span>
              <span>{f.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="landing-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Pemerintah Kota Malang
        </motion.p>
      </div>
    </div>
  );
}
