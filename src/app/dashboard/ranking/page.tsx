'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getMaturityLevel, formatScore } from '@/lib/utils';
import type { TransaksiEvaluasi } from '@/lib/types';
import * as XLSX from 'xlsx';

export default function RankingPage() {
  const [data, setData] = useState<(TransaksiEvaluasi & { profiles: { nama_instansi: string; full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const supabase = createClient();

  useEffect(() => {
    fetchRanking();
  }, [filterYear]);

  const fetchRanking = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('transaksi_evaluasi')
      .select('*, profiles(nama_instansi, full_name)')
      .eq('periode_tahun', filterYear)
      .order('total_skor', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const exportToExcel = () => {
    const exportData = data.map((t, i) => {
      const level = getMaturityLevel(t.total_skor || 0);
      return {
        'Ranking': i + 1,
        'OPD/Instansi': t.profiles?.nama_instansi || 'N/A',
        'Periode': t.periode_tahun,
        'Total Skor': t.total_skor,
        'Level Kematangan': `Level ${level.level} (${level.label})`,
        'Tanggal Submit': new Date(t.tanggal_submit).toLocaleDateString('id-ID'),
        'Status': t.status,
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ranking Kematangan');

    // Auto width columns
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...exportData.map((row) => String((row as any)[key]).length)) + 2,
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `Ranking_Kematangan_${filterYear}.xlsx`);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🏆 Ranking Tingkat Kematangan</h1>
        <p className="page-subtitle">Peringkat OPD berdasarkan total skor evaluasi</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
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
        </div>
        {data.length > 0 && (
          <button onClick={exportToExcel} className="btn btn-success btn-sm">
            📥 Export Excel
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Ranking</th>
                  <th>OPD / Instansi</th>
                  <th>Skor</th>
                  <th>Level Kematangan</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 60 }}>
                      <div className="empty-state">
                        <h3>Belum ada data ranking</h3>
                        <p>Belum ada evaluasi untuk tahun {filterYear}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((t, i) => {
                    const level = getMaturityLevel(t.total_skor || 0);
                    const rankIcon = getRankIcon(i + 1);
                    return (
                      <tr key={t.id}>
                        <td style={{ textAlign: 'center' }}>
                          {rankIcon ? (
                            <span className="rank-medal">{rankIcon}</span>
                          ) : (
                            <span className="rank-number">{i + 1}</span>
                          )}
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {t.profiles?.nama_instansi || 'N/A'}
                        </td>
                        <td style={{ fontWeight: 700, fontSize: 18, color: level.color }}>
                          {formatScore(t.total_skor || 0)}
                        </td>
                        <td>
                          <span className={`badge badge-level-${level.level}`}>
                            Level {level.level} ({level.label})
                          </span>
                        </td>
                        <td style={{ minWidth: 150 }}>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${((t.total_skor || 0) / 5) * 100}%`,
                                background: `linear-gradient(90deg, ${level.color}, ${level.color}88)`,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
