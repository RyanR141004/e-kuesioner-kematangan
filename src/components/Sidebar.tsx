'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';
  const isOperator = profile?.role === 'operator';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/kuesioner', label: 'Isi Kuesioner', icon: '📝', hideFor: ['admin'] },
    { href: '/dashboard/ranking', label: 'Ranking OPD', icon: '🏆' },
    { href: '/dashboard/detail', label: 'Detail Jawaban', icon: '📋' },
    { href: '/dashboard/laporan', label: 'Laporan', icon: '📄' },
    ...(isAdmin ? [
      { href: '/admin/users', label: 'Kelola Pengguna', icon: '👥' },
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
        ☰
      </button>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">EK</div>
          <div>
            <div className="sidebar-logo-text">E-Kuesioner</div>
            <div className="sidebar-logo-sub">Kematangan PD</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems
            .filter(item => !(item as any).hideFor?.includes(profile?.role))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info" style={{ marginBottom: 12 }}>
            <div className="user-avatar">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="user-name">{profile?.full_name || 'User'}</div>
              <div className="user-role">{profile?.role || 'opd'}</div>
            </div>
          </div>
          {profile?.nama_instansi && (
            <div style={{
              fontSize: 12, color: 'var(--text-muted)', padding: '0 12px',
              marginBottom: 12,
            }}>
              🏛️ {profile.nama_instansi}
            </div>
          )}
          <button onClick={handleSignOut} className="nav-link" style={{ color: '#ef4444' }}>
            <span>🚪</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
