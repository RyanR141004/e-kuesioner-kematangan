'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getMaturityLevel, formatScore, formatDate, MATURITY_LEVELS } from '@/lib/utils';
import type { TransaksiEvaluasi, DetailJawaban, VariabelEvaluasi } from '@/lib/types';
import * as XLSX from 'xlsx';

function getRekomendasi(level: number): string[] {
  switch (level) {
    case 1:
      return [
        'Membangun sistem dasar manajemen SDM dan organisasi',
        'Menyusun dokumen perencanaan SDM secara formal',
        'Mengadakan pelatihan dasar bagi seluruh pegawai',
        'Membentuk tim khusus untuk pengelolaan SDM',
      ];
    case 2:
      return [
        'Menyempurnakan prosedur operasional standar (SOP) yang ada',
        'Meningkatkan dokumentasi proses kerja',
        'Mengembangkan sistem monitoring dan evaluasi berkala',
        'Melakukan benchmarking dengan instansi yang lebih maju',
      ];
    case 3:
      return [
        'Mengintegrasikan sistem informasi antar unit kerja',
        'Menerapkan sistem pengukuran kinerja berbasis outcome',
        'Mengembangkan program pengembangan kompetensi lanjutan',
        'Meningkatkan kolaborasi antar unit dalam pengelolaan SDM',
      ];
    case 4:
      return [
        'Mengoptimalkan penggunaan data analytics untuk pengambilan keputusan',
        'Mengembangkan inovasi dalam pelayanan publik',
        'Menerapkan continuous improvement secara sistematis',
        'Memperkuat budaya kerja berbasis kinerja',
      ];
    case 5:
      return [
        'Mempertahankan dan meningkatkan standar yang sudah optimal',
        'Menjadi role model bagi instansi lain',
        'Mengembangkan knowledge sharing antar instansi',
        'Berinovasi secara berkelanjutan untuk adaptasi perubahan',
      ];
    default:
      return ['Memulai evaluasi dan perbaikan mendasar'];
  }
}

export default function LaporanPage() {
  const [transaksi, setTransaksi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [generating, setGenerating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [filterYear]);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('transaksi_evaluasi')
      .select('*, profiles(nama_instansi, full_name), kelembagaan(nama), detail_jawaban(*, variabel_evaluasi(*))')
      .eq('periode_tahun', filterYear)
      .order('total_skor', { ascending: false });
    setTransaksi(data || []);
    setLoading(false);
  };

  const exportFullExcel = () => {
    if (transaksi.length === 0) return;

    const wb = XLSX.utils.book_new();

    // Sheet 1: Ringkasan Ranking
    const rankingData = transaksi.map((t, i) => {
      const level = getMaturityLevel(t.total_skor || 0);
      return {
        'Ranking': i + 1,
        'Kelembagaan': t.kelembagaan?.nama || t.profiles?.nama_instansi || 'N/A',
        'Penanggung Jawab': t.profiles?.full_name || 'N/A',
        'Total Skor': t.total_skor,
        'Level Kematangan': `Level ${level.level} (${level.label})`,
        'Tanggal Submit': formatDate(t.tanggal_submit),
      };
    });
    const ws1 = XLSX.utils.json_to_sheet(rankingData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Ranking');

    // Sheet 2: Detail per OPD
    const detailData: any[] = [];
    transaksi.forEach((t: any) => {
      t.detail_jawaban?.forEach((d: any) => {
        detailData.push({
          'Kelembagaan': t.kelembagaan?.nama || t.profiles?.nama_instansi || 'N/A',
          'Variabel': d.variabel_evaluasi?.nama_variabel || 'N/A',
          'Tingkat Capaian': d.tingkat_capaian,
          'Link Data Dukung': d.link_drive_dukung || '-',
        });
      });
    });
    if (detailData.length > 0) {
      const ws2 = XLSX.utils.json_to_sheet(detailData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Detail Jawaban');
    }

    // Sheet 3: Rekomendasi
    const rekomendasiData = transaksi.map((t) => {
      const level = getMaturityLevel(t.total_skor || 0);
      const rekom = getRekomendasi(level.level);
      return {
        'Kelembagaan': t.kelembagaan?.nama || t.profiles?.nama_instansi || 'N/A',
        'Level Saat Ini': `Level ${level.level} (${level.label})`,
        'Skor': t.total_skor,
        'Rekomendasi 1': rekom[0] || '',
        'Rekomendasi 2': rekom[1] || '',
        'Rekomendasi 3': rekom[2] || '',
        'Rekomendasi 4': rekom[3] || '',
      };
    });
    const ws3 = XLSX.utils.json_to_sheet(rekomendasiData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Rekomendasi');

    XLSX.writeFile(wb, `Laporan_Evaluasi_Kematangan_${filterYear}.xlsx`);
  };

  const printPDF = () => {
    setGenerating(true);
    setTimeout(() => {
      window.print();
      setGenerating(false);
    }, 500);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @media print {
          .sidebar, .mobile-toggle, .no-print { display: none !important; }
          .main-content { margin-left: 0 !important; padding: 20px !important; }
          .card { break-inside: avoid; box-shadow: none !important; border: 1px solid #ddd !important; }
          body { background: white !important; color: black !important; }
          .page-title, .card-title, h2, h3 { color: black !important; }
          .stat-card, .data-table td, .data-table th { color: black !important; }
          .badge { border: 1px solid #ccc !important; }
          .print-header { display: block !important; }
        }
        .print-header { display: none; }
      `}</style>

      {/* Print-only header */}
      <div className="print-header" style={{ textAlign: 'center', marginBottom: 30, paddingBottom: 20, borderBottom: '2px solid #333' }}>
        <h1 style={{ fontSize: 20, marginBottom: 4 }}>LAPORAN EVALUASI TINGKAT KEMATANGAN</h1>
        <h2 style={{ fontSize: 16, fontWeight: 400, marginBottom: 4 }}>SDM & Organisasi Perangkat Daerah</h2>
        <p style={{ fontSize: 13 }}>Berdasarkan Permendagri No 99 Tahun 2018 — Periode {filterYear}</p>
      </div>

      <div className="page-header no-print">
        <h1 className="page-title">📄 Laporan Evaluasi</h1>
        <p className="page-subtitle">Generate laporan lengkap dengan ranking, skor, dan rekomendasi peningkatan</p>
      </div>

      <div className="no-print" style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          className="form-select"
          value={filterYear}
          onChange={(e) => setFilterYear(Number(e.target.value))}
          style={{ width: 160 }}
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>Tahun {y}</option>
          ))}
        </select>

        {transaksi.length > 0 && (
          <>
            <button onClick={printPDF} className="btn btn-primary btn-sm" disabled={generating}>
              {generating ? '⏳ Menyiapkan...' : '📄 Export PDF'}
            </button>
            <button onClick={exportFullExcel} className="btn btn-success btn-sm">
              📥 Export Excel
            </button>
          </>
        )}
      </div>

      {transaksi.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>Belum ada data</h3>
            <p>Belum ada evaluasi untuk tahun {filterYear}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Ringkasan */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div>
                <div className="card-title">📊 Ringkasan Hasil Evaluasi</div>
                <div className="card-subtitle">Periode Tahun {filterYear}</div>
              </div>
            </div>
            <div className="stats-grid" style={{ marginBottom: 0 }}>
              <div className="stat-card">
                <div className="stat-value">{transaksi.length}</div>
                <div className="stat-label">Total Kelembagaan Dievaluasi</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {formatScore(transaksi.reduce((a, t) => a + (t.total_skor || 0), 0) / transaksi.length)}
                </div>
                <div className="stat-label">Rata-rata Skor</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{formatScore(Math.max(...transaksi.map(t => t.total_skor || 0)))}</div>
                <div className="stat-label">Skor Tertinggi</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{formatScore(Math.min(...transaksi.map(t => t.total_skor || 0)))}</div>
                <div className="stat-label">Skor Terendah</div>
              </div>
            </div>
          </div>

          {/* Ranking Table */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title">🏆 Ranking Kelembagaan</div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ranking</th>
                    <th>Kelembagaan</th>
                    <th>Skor</th>
                    <th>Level Kematangan</th>
                  </tr>
                </thead>
                <tbody>
                  {transaksi.map((t, i) => {
                    const level = getMaturityLevel(t.total_skor || 0);
                    return (
                      <tr key={t.id}>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>
                          {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {t.kelembagaan?.nama || t.profiles?.nama_instansi || 'N/A'}
                        </td>
                        <td style={{ fontWeight: 700, color: level.color }}>{formatScore(t.total_skor || 0)}</td>
                        <td>
                          <span className={`badge badge-level-${level.level}`}>
                            Level {level.level} ({level.label})
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rekomendasi per OPD */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">💡 Rekomendasi Peningkatan</div>
            </div>
            {transaksi.map((t) => {
              const level = getMaturityLevel(t.total_skor || 0);
              const rekom = getRekomendasi(level.level);
              return (
                <div key={t.id} style={{
                  padding: 20, marginBottom: 16,
                  background: 'var(--bg-secondary)', borderRadius: 12,
                  border: '1px solid var(--glass-border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {t.kelembagaan?.nama || t.profiles?.nama_instansi || 'N/A'}
                    </h3>
                    <span className={`badge badge-level-${level.level}`}>
                      Skor {formatScore(t.total_skor || 0)} — Level {level.level}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    {rekom.map((r, i) => (
                      <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.6 }}>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
