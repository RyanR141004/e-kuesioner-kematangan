'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isAdmin = profile?.role === 'admin';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊', desc: 'Ringkasan data' },
    { href: '/kuesioner', label: 'Isi Kuesioner', icon: '📝', desc: 'Form evaluasi', hideFor: ['admin'] },
    { href: '/dashboard/ranking', label: 'Ranking', icon: '🏆', desc: 'Peringkat OPD' },
    { href: '/dashboard/detail', label: 'Detail Jawaban', icon: '📋', desc: 'Data lengkap' },
    { href: '/dashboard/laporan', label: 'Laporan', icon: '📄', desc: 'Export & cetak' },
    ...(isAdmin ? [
      { href: '/admin/users', label: 'Kelola Pengguna', icon: '👥', desc: 'Manajemen user' },
    ] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        <motion.span animate={{ rotate: mobileOpen ? 90 : 0 }}>☰</motion.span>
      </button>

      {mobileOpen && (
        <motion.div
          className="sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Sidebar background decoration */}
        <div className="sidebar-bg-accent" />

        <div className="sidebar-logo">
          <motion.div
            className="sidebar-logo-icon"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            EK
          </motion.div>
          <div>
            <div className="sidebar-logo-text">E-Kuesioner</div>
            <div className="sidebar-logo-sub">Kematangan PD</div>
          </div>
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
          {navItems
            .filter(item => !(item as any).hideFor?.includes(profile?.role))
            .map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onHoverStart={() => setHoveredItem(item.href)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="nav-link-icon">{item.icon}</span>
                    <div className="nav-link-content">
                      <span className="nav-link-label">{item.label}</span>
                      {(hoveredItem === item.href || isActive) && (
                        <motion.span
                          className="nav-link-desc"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {item.desc}
                        </motion.span>
                      )}
                    </div>
                    {isActive && (
                      <motion.div
                        className="nav-active-dot"
                        layoutId="activeNav"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
        </nav>

        <div className="sidebar-divider" />

        <div className="sidebar-footer">
          <motion.div
            className="user-info"
            whileHover={{ scale: 1.02 }}
            style={{ marginBottom: 12 }}
          >
            <div className="user-avatar">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="user-name">{profile?.full_name || 'User'}</div>
              <div className="user-role">{profile?.role || 'opd'}</div>
            </div>
          </motion.div>
          {profile?.nama_instansi && (
            <div className="sidebar-instansi">
              🏛️ {profile.nama_instansi}
            </div>
          )}
          <motion.button
            onClick={handleSignOut}
            className="nav-link sidebar-logout"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>🚪</span>
            <span>Keluar</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
}
