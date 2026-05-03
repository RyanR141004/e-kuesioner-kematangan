'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getMaturityLevel, formatScore, formatDate, MATURITY_LEVELS } from '@/lib/utils';
import type { TransaksiEvaluasi, DetailJawaban, VariabelEvaluasi } from '@/lib/types';
import * as XLSX from 'xlsx';

export default function DetailPage() {
  const [transaksi, setTransaksi] = useState<(TransaksiEvaluasi & {
    profiles: { nama_instansi: string; full_name: string };
  })[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<(DetailJawaban & { variabel_evaluasi: VariabelEvaluasi })[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const fetchTransaksi = async () => {
    const { data } = await supabase
      .from('transaksi_evaluasi')
      .select('*, profiles(nama_instansi, full_name)')
      .order('tanggal_submit', { ascending: false });
    setTransaksi(data || []);
    setLoading(false);
  };

  const viewDetail = async (id: string) => {
    setSelectedId(id);
    setDetailLoading(true);
    const { data } = await supabase
      .from('detail_jawaban')
      .select('*, variabel_evaluasi(*)')
      .eq('transaksi_id', id)
      .order('variabel_evaluasi(urutan)', { ascending: true });
    setDetail(data || []);
    setDetailLoading(false);
  };

  const closeDetail = () => {
    setSelectedId(null);
    setDetail([]);
  };

  const selectedTransaksi = transaksi.find((t) => t.id === selectedId);

  const exportDetailExcel = () => {
    const allData: any[] = [];
    transaksi.forEach((t) => {
      allData.push({
        'OPD/Instansi': t.profiles?.nama_instansi || 'N/A',
        'Penanggung Jawab': t.profiles?.full_name || 'N/A',
        'Periode': t.periode_tahun,
        'Total Skor': t.total_skor,
        'Level Kematangan': t.level_kematangan,
        'Tanggal Submit': formatDate(t.tanggal_submit),
        'Status': t.status,
      });
    });
    const ws = XLSX.utils.json_to_sheet(allData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Detail Evaluasi');
    XLSX.writeFile(wb, `Detail_Evaluasi_${new Date().getFullYear()}.xlsx`);
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
      <div className="page-header">
        <h1 className="page-title">📋 Detail Jawaban</h1>
        <p className="page-subtitle">Lihat detail jawaban setiap instansi beserta bukti data dukung</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        {transaksi.length > 0 && (
          <button onClick={exportDetailExcel} className="btn btn-success btn-sm">
            📥 Export Semua ke Excel
          </button>
        )}
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Instansi/OPD</th>
                <th>Penanggung Jawab</th>
                <th>Skor</th>
                <th>Level</th>
                <th>Tanggal Submit</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transaksi.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 60 }}>
                    Belum ada data evaluasi
                  </td>
                </tr>
              ) : (
                transaksi.map((t, i) => {
                  const level = getMaturityLevel(t.total_skor || 0);
                  return (
                    <tr key={t.id}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {t.profiles?.nama_instansi || 'N/A'}
                      </td>
                      <td>{t.profiles?.full_name || 'N/A'}</td>
                      <td style={{ fontWeight: 700 }}>{formatScore(t.total_skor || 0)}</td>
                      <td>
                        <span className={`badge badge-level-${level.level}`}>
                          Level {level.level}
                        </span>
                      </td>
                      <td>{formatDate(t.tanggal_submit)}</td>
                      <td>
                        <button
                          onClick={() => viewDetail(t.id)}
                          className="btn btn-primary btn-sm"
                        >
                          📄 Lihat Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedId && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDetail}>✕</button>

            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              Detail Evaluasi
            </h2>
            {selectedTransaksi && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  {selectedTransaksi.profiles?.nama_instansi} — Periode {selectedTransaksi.periode_tahun}
                </p>
                <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                  <span className={`badge badge-level-${getMaturityLevel(selectedTransaksi.total_skor || 0).level}`}>
                    Skor: {formatScore(selectedTransaksi.total_skor || 0)}
                  </span>
                  <span className="badge" style={{
                    background: 'rgba(59,130,246,0.15)', color: '#3b82f6',
                  }}>
                    {selectedTransaksi.level_kematangan}
                  </span>
                </div>
              </div>
            )}

            {detailLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <div className="spinner" />
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Variabel</th>
                      <th>Tingkat</th>
                      <th>Data Dukung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.map((d, i) => (
                      <tr key={d.id}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                          {d.variabel_evaluasi?.nama_variabel || 'N/A'}
                        </td>
                        <td>
                          <span className={`badge badge-level-${d.tingkat_capaian}`}>
                            Tingkat {d.tingkat_capaian}
                          </span>
                        </td>
                        <td>
                          {d.link_drive_dukung ? (
                            <a
                              href={d.link_drive_dukung}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: 12 }}
                            >
                              🔗 Lihat Bukti
                            </a>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                              Tidak ada
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
