'use client';

import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function AdminContent({ children }: { children: React.ReactNode }) {
  const { loading, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && profile?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [loading, profile]);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <p>Memuat...</p>
      </div>
    );
  }

  if (profile?.role !== 'admin') return null;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminContent>{children}</AdminContent>
    </AuthProvider>
  );
}
