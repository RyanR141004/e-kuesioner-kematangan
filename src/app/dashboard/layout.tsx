'use client';

import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';
import PageTransition from '@/components/PageTransition';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-blob">
          <div className="blob-inner" />
        </div>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {/* Subtle background grid */}
        <div className="main-bg-grid" />
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
