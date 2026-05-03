'use client';

import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';

function KuesionerContent({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <p>Memuat...</p>
      </div>
    );
  }
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function KuesionerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <KuesionerContent>{children}</KuesionerContent>
    </AuthProvider>
  );
}
