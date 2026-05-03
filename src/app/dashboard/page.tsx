'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { getMaturityLevel, formatScore, MATURITY_LEVELS } from '@/lib/utils';
import type { TransaksiEvaluasi } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [transaksi, setTransaksi] = useState<(TransaksiEvaluasi & { profiles: { nama_instansi: string; full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from('transaksi_evaluasi')
      .select('*, profiles(nama_instansi, full_name)')
      .order('total_skor', { ascending: false });

    setTransaksi(data || []);
    setLoading(false);
  };

  const totalOPD = new Set(transaksi.map((t) => t.opd_id)).size;
  const avgScore = transaksi.length > 0
    ? transaksi.reduce((a, t) => a + (t.total_skor || 0), 0) / transaksi.length
    : 0;
  const highestScore = transaksi.length > 0
    ? Math.max(...transaksi.map((t) => t.total_skor || 0))
    : 0;

  // Data for charts
  const barData = transaksi.slice(0, 10).map((t) => ({
    name: t.profiles?.nama_instansi || 'N/A',
    skor: t.total_skor || 0,
  }));

  const levelCounts = MATURITY_LEVELS.map((ml) => ({
    name: `Level ${ml.level} (${ml.label})`,
    value: transaksi.filter((t) => {
      const level = getMaturityLevel(t.total_skor || 0);
      return level.level === ml.level;
    }).length,
    color: ml.color,
  })).filter((l) => l.value > 0);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Selamat datang, {profile?.full_name || 'User'}
          {profile?.nama_instansi ? ` — ${profile.nama_instansi}` : ''}
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📊</div>
          <div className="stat-value">{transaksi.length}</div>
          <div className="stat-label">Total Evaluasi</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🏛️</div>
          <div className="stat-value">{totalOPD}</div>
          <div className="stat-label">OPD Terdaftar</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📈</div>
          <div className="stat-value">{formatScore(avgScore)}</div>
          <div className="stat-label">Rata-rata Skor</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🏆</div>
          <div className="stat-value">{formatScore(highestScore)}</div>
          <div className="stat-label">Skor Tertinggi</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 32 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Grafik Perbandingan Skor</div>
              <div className="card-subtitle">Top 10 OPD berdasarkan skor</div>
            </div>
          </div>
          <div className="chart-container">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }}
                    angle={-45} textAnchor="end" height={80}
                  />
                  <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#1a2235', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, color: '#f1f5f9',
                    }}
                  />
                  <Bar dataKey="skor" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <h3>Belum ada data</h3>
                <p>Evaluasi belum dilakukan</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Sebaran Level</div>
              <div className="card-subtitle">Distribusi kematangan</div>
            </div>
          </div>
          <div className="chart-container">
            {levelCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelCounts} cx="50%" cy="45%"
                    innerRadius={60} outerRadius={100}
                    dataKey="value" paddingAngle={4}
                  >
                    {levelCounts.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a2235', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, color: '#f1f5f9',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <h3>Belum ada data</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent evaluations table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Evaluasi Terbaru</div>
            <div className="card-subtitle">Daftar evaluasi yang telah disubmit</div>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Instansi/OPD</th>
                <th>Periode</th>
                <th>Skor</th>
                <th>Level Kematangan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transaksi.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>
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
                      <td>{t.periode_tahun}</td>
                      <td style={{ fontWeight: 700 }}>{formatScore(t.total_skor || 0)}</td>
                      <td>
                        <span className={`badge badge-level-${level.level}`}>
                          Level {level.level} ({level.label})
                        </span>
                      </td>
                      <td>
                        <span className="badge" style={{
                          background: 'rgba(34,197,94,0.15)',
                          color: '#22c55e',
                        }}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
