import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'E-Kuesioner | Evaluasi Tingkat Kematangan SDM & Organisasi',
  description: 'Sistem E-Kuesioner Evaluasi Tingkat Kematangan SDM & Organisasi Perangkat Daerah berdasarkan Permendagri No 99 Tahun 2018',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
