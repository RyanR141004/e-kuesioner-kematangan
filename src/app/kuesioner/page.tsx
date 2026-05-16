'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { INSTRUMEN_PERTANYAAN } from '@/lib/data';
import type { Kelembagaan } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface FormValues {
  kelembagaan_id: string;
  periode_tahun: number;
  jawaban: {
    pertanyaan_id: number;
    tingkat_capaian: number;
    link_drive_dukung: string;
  }[];
}

const LEVEL_COLORS: Record<number, string> = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#22c55e',
  5: '#3b82f6',
};

const LEVEL_LABELS: Record<number, string> = {
  1: 'Tingkat I (Initial)',
  2: 'Tingkat II (Developing)',
  3: 'Tingkat III (Defined)',
  4: 'Tingkat IV (Managed)',
  5: 'Tingkat V (Optimized)',
};

export default function KuesionerPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [kelembagaanList, setKelembagaanList] = useState<Kelembagaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  const [progress, setProgress] = useState(0);

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      kelembagaan_id: '',
      periode_tahun: new Date().getFullYear(),
      jawaban: INSTRUMEN_PERTANYAAN.map((q) => ({
        pertanyaan_id: q.id,
        tingkat_capaian: 0,
        link_drive_dukung: '',
      })),
    },
  });

  const watchJawaban = watch('jawaban');

  // Calculate progress
  useEffect(() => {
    const answered = watchJawaban?.filter((j) => j.tingkat_capaian > 0).length || 0;
    setProgress(Math.round((answered / INSTRUMEN_PERTANYAAN.length) * 100));
  }, [watchJawaban]);

  useEffect(() => {
    fetchKelembagaan();
  }, []);

  const fetchKelembagaan = async () => {
    const { data } = await supabase
      .from('kelembagaan')
      .select('*')
      .order('urutan', { ascending: true });
    if (data) setKelembagaanList(data);
    setLoading(false);
  };

  const showToast = (type: string, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const onSubmit = async (data: FormValues) => {
    if (!data.kelembagaan_id) {
      showToast('error', 'Silakan pilih Kelembagaan terlebih dahulu');
      return;
    }

    for (const j of data.jawaban) {
      if (!j.tingkat_capaian || j.tingkat_capaian === 0) {
        const q = INSTRUMEN_PERTANYAAN.find((q) => q.id === j.pertanyaan_id);
        showToast('error', `Silakan pilih tingkat capaian untuk pertanyaan ${q?.id}`);
        return;
      }
    }

    for (const j of data.jawaban) {
      if (j.tingkat_capaian > 1) {
        if (!j.link_drive_dukung || j.link_drive_dukung.trim() === '') {
          showToast('error', `Link Data Dukung wajib diisi untuk pertanyaan ${j.pertanyaan_id} (Level ${j.tingkat_capaian})`);
          return;
        }
        try {
          new URL(j.link_drive_dukung);
        } catch {
          showToast('error', `URL tidak valid untuk pertanyaan ${j.pertanyaan_id}. Pastikan format benar.`);
          return;
        }
      }
    }

    setSubmitting(true);

    try {
      // Fetch variabel_evaluasi IDs to map to questions
      const { data: variabelData } = await supabase
        .from('variabel_evaluasi')
        .select('id, urutan')
        .order('urutan', { ascending: true });

      const variabelMap = new Map<number, string>();
      variabelData?.forEach((v: any) => {
        variabelMap.set(v.urutan, v.id);
      });

      const response = await fetch('/api/evaluasi/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opd_id: profile?.id,
          kelembagaan_id: data.kelembagaan_id,
          periode_tahun: data.periode_tahun,
          jawaban: data.jawaban.map((j) => ({
            variabel_id: variabelMap.get(j.pertanyaan_id) || j.pertanyaan_id.toString(),
            tingkat_capaian: j.tingkat_capaian,
            link_drive_dukung: j.tingkat_capaian > 1 ? j.link_drive_dukung : null,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan evaluasi');
      }

      showToast('success', `✅ Data berhasil disimpan! Skor: ${result.total_skor} — ${result.level_kematangan}`);

      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    } catch (err: any) {
      showToast('error', err.message || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
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
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast toast-${toast.type}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            {toast.type === 'success' ? '✅' : '❌'} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-header">
        <h1 className="page-title">📝 Kuesioner Evaluasi Kematangan</h1>
        <p className="page-subtitle">
          Permendagri No 99 Tahun 2018 — {profile?.nama_instansi}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Progress Pengisian</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: progress === 100 ? '#22c55e' : 'var(--text-secondary)' }}>
            {progress}%
          </span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            style={{ background: progress === 100 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Identitas Evaluasi */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div className="card-title">📋 Identitas Evaluasi</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pilih Kelembagaan <span className="form-required">*</span></label>
              <select className="form-select" {...register('kelembagaan_id')} required>
                <option value="">-- Pilih Kelembagaan --</option>
                {kelembagaanList.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Periode Tahun</label>
              <select className="form-select" {...register('periode_tahun', { valueAsNumber: true })}>
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
            Instrumen Evaluasi ({INSTRUMEN_PERTANYAAN.length} Pertanyaan)
          </h2>

          {INSTRUMEN_PERTANYAAN.map((pertanyaan, index) => {
            const currentLevel = watchJawaban?.[index]?.tingkat_capaian ?? 0;
            const levelKey = currentLevel.toString() as "1" | "2" | "3" | "4" | "5";
            const selectedKriteria = currentLevel > 0 ? pertanyaan.kriteria[levelKey] : null;
            const needBukti = selectedKriteria && selectedKriteria.syarat_data_dukung !== "Tidak ada data dukung";

            return (
              <motion.div
                key={pertanyaan.id}
                className="card"
                style={{ marginBottom: 16, position: 'relative' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                {/* Question header */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: currentLevel > 0
                      ? `linear-gradient(135deg, ${LEVEL_COLORS[currentLevel]}, ${LEVEL_COLORS[currentLevel]}88)`
                      : 'rgba(100,116,139,0.15)',
                    color: currentLevel > 0 ? 'white' : 'var(--text-muted)',
                    fontSize: 14, fontWeight: 700,
                    transition: 'all 0.3s ease',
                  }}>
                    {pertanyaan.id}
                  </span>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                    {pertanyaan.soal}
                  </h3>
                </div>

                {/* Level selection */}
                <div style={{ marginBottom: 12 }}>
                  <label className="form-label" style={{ marginBottom: 10 }}>
                    Pilih Tingkat Capaian <span className="form-required">*</span>
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {([1, 2, 3, 4, 5] as const).map((level) => {
                      const isSelected = currentLevel === level;
                      const kriteria = pertanyaan.kriteria[level.toString() as "1" | "2" | "3" | "4" | "5"];

                      return (
                        <label
                          key={level}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 12,
                            padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
                            background: isSelected ? `rgba(${level === 1 ? '239,68,68' : level === 2 ? '249,115,22' : level === 3 ? '234,179,8' : level === 4 ? '34,197,94' : '59,130,246'},0.08)` : 'rgba(255,255,255,0.02)',
                            border: `1.5px solid ${isSelected ? LEVEL_COLORS[level] + '60' : 'rgba(255,255,255,0.06)'}`,
                            transition: 'all 0.25s ease',
                          }}
                        >
                          <input
                            type="radio"
                            value={level}
                            checked={isSelected}
                            onChange={() => setValue(`jawaban.${index}.tingkat_capaian`, level)}
                            style={{ marginTop: 3, accentColor: LEVEL_COLORS[level] }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontWeight: 600, fontSize: 13, color: isSelected ? LEVEL_COLORS[level] : 'var(--text-primary)',
                              display: 'flex', alignItems: 'center', gap: 8,
                            }}>
                              {LEVEL_LABELS[level]}
                              {level === 1 && (
                                <span style={{
                                  fontSize: 10, padding: '1px 8px', borderRadius: 4,
                                  background: 'rgba(107,114,128,0.15)', color: 'var(--text-muted)',
                                }}>
                                  Tanpa bukti
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                              {kriteria.deskripsi}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Criteria Callout */}
                <AnimatePresence>
                  {selectedKriteria && currentLevel > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: 16, borderRadius: 12, marginTop: 4, marginBottom: needBukti ? 12 : 0,
                        background: `rgba(${currentLevel === 1 ? '239,68,68' : currentLevel === 2 ? '249,115,22' : currentLevel === 3 ? '234,179,8' : currentLevel === 4 ? '34,197,94' : '59,130,246'},0.06)`,
                        borderLeft: `3px solid ${LEVEL_COLORS[currentLevel]}`,
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: LEVEL_COLORS[currentLevel], marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          📌 Syarat Data Dukung — {LEVEL_LABELS[currentLevel]}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                          {selectedKriteria.syarat_data_dukung}
                        </div>
                      </div>

                      {/* Drive link input (only for level > 1) */}
                      {needBukti && (
                        <div style={{
                          padding: 16, borderRadius: 12,
                          background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)',
                        }}>
                          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            🔗 Link Google Drive Data Dukung <span className="form-required">*</span>
                          </label>
                          <input
                            type="url"
                            className="form-input"
                            placeholder="https://drive.google.com/drive/folders/..."
                            {...register(`jawaban.${index}.link_drive_dukung`)}
                          />
                          <p className="form-hint" style={{ marginTop: 6 }}>
                            Upload dokumen sesuai syarat di atas ke Google Drive, lalu tempelkan link folder-nya di sini
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Submit */}
        <div className="card" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', bottom: 20, backdropFilter: 'blur(10px)',
          background: 'rgba(26,34,53,0.95)', flexWrap: 'wrap', gap: 16,
          zIndex: 10,
        }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              {progress === 100 ? '✅ Semua pertanyaan telah dijawab!' : `${watchJawaban?.filter(j => j.tingkat_capaian > 0).length || 0} dari ${INSTRUMEN_PERTANYAAN.length} pertanyaan dijawab`}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Pastikan semua jawaban dan bukti data dukung sudah benar
            </p>
          </div>
          <motion.button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting || progress < 100}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {submitting ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Menyimpan...
              </>
            ) : (
              '✅ Submit Evaluasi'
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
