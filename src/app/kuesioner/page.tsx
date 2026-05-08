'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { TINGKAT_OPTIONS } from '@/lib/utils';
import type { VariabelEvaluasi, Kelembagaan } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface FormValues {
  kelembagaan_id: string;
  periode_tahun: number;
  jawaban: {
    variabel_id: string;
    nama_variabel: string;
    deskripsi: string;
    link_petunjuk: string;
    urutan: number;
    tingkat_capaian: number;
    link_drive_dukung: string;
  }[];
}

export default function KuesionerPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [variabel, setVariabel] = useState<VariabelEvaluasi[]>([]);
  const [kelembagaanList, setKelembagaanList] = useState<Kelembagaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

  const { register, handleSubmit, watch, setValue, control } = useForm<FormValues>({
    defaultValues: {
      kelembagaan_id: '',
      periode_tahun: new Date().getFullYear(),
      jawaban: [],
    },
  });

  const { fields } = useFieldArray({ control, name: 'jawaban' });

  useEffect(() => {
    fetchVariabel();
    fetchKelembagaan();
  }, []);

  const fetchKelembagaan = async () => {
    const { data } = await supabase
      .from('kelembagaan')
      .select('*')
      .order('urutan', { ascending: true });
    if (data) setKelembagaanList(data);
  };

  const fetchVariabel = async () => {
    const { data } = await supabase
      .from('variabel_evaluasi')
      .select('*')
      .order('urutan', { ascending: true });

    if (data) {
      setVariabel(data);
      setValue('jawaban', data.map((v) => ({
        variabel_id: v.id,
        nama_variabel: v.nama_variabel,
        deskripsi: v.deskripsi,
        link_petunjuk: v.link_petunjuk || '',
        urutan: v.urutan,
        tingkat_capaian: 0,
        link_drive_dukung: '',
      })));
    }
    setLoading(false);
  };

  const showToast = (type: string, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const onSubmit = async (data: FormValues) => {
    // Validate kelembagaan selected
    if (!data.kelembagaan_id) {
      showToast('error', 'Silakan pilih Kelembagaan terlebih dahulu');
      return;
    }

    // Validate all questions answered
    for (const j of data.jawaban) {
      if (!j.tingkat_capaian || j.tingkat_capaian === 0) {
        showToast('error', `Silakan pilih tingkat capaian untuk soal "${j.nama_variabel}"`);
        return;
      }
    }

    // Validate URLs for tingkat > 1
    for (const j of data.jawaban) {
      if (j.tingkat_capaian > 1) {
        if (!j.link_drive_dukung || j.link_drive_dukung.trim() === '') {
          showToast('error', `Link Data Dukung wajib diisi untuk soal nomor ${j.urutan} (Tingkat ${j.tingkat_capaian})`);
          return;
        }
        try {
          new URL(j.link_drive_dukung);
        } catch {
          showToast('error', `URL tidak valid untuk soal nomor ${j.urutan}. Pastikan format URL benar.`);
          return;
        }
      }
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/evaluasi/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opd_id: profile?.id,
          kelembagaan_id: data.kelembagaan_id,
          periode_tahun: data.periode_tahun,
          jawaban: data.jawaban.map((j) => ({
            variabel_id: j.variabel_id,
            tingkat_capaian: j.tingkat_capaian,
            link_drive_dukung: j.tingkat_capaian > 1 ? j.link_drive_dukung : null,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan evaluasi');
      }

      showToast('success', `Data berhasil disimpan! Terima kasih! Skor: ${result.total_skor} — ${result.level_kematangan}`);

      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    } catch (err: any) {
      showToast('error', err.message || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const watchJawaban = watch('jawaban');

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
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">📝 Kuesioner Evaluasi Kematangan</h1>
        <p className="page-subtitle">
          Permendagri No 99 Tahun 2018 — {profile?.nama_instansi}
        </p>
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

        {/* Questions - Card based */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
            Instrumen Evaluasi ({fields.length} Pertanyaan)
          </h2>

          {fields.map((field, index) => {
            const currentTingkat = watchJawaban?.[index]?.tingkat_capaian ?? 0;
            const selectedOption = TINGKAT_OPTIONS.find(o => o.value === currentTingkat);

            return (
              <div key={field.id} className="card" style={{ marginBottom: 16, position: 'relative' }}>
                {/* Question header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: currentTingkat > 0 ? 'var(--primary)' : 'var(--bg-tertiary)',
                      color: currentTingkat > 0 ? 'white' : 'var(--text-muted)',
                      fontSize: 14, fontWeight: 700,
                    }}>
                      {index + 1}
                    </span>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                      {field.nama_variabel}
                    </h3>
                  </div>

                  {/* Lihat Petunjuk button */}
                  {field.link_petunjuk && (
                    <a
                      href={field.link_petunjuk}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                        color: '#22c55e', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                    >
                      📂 Lihat Petunjuk
                    </a>
                  )}
                </div>

                {/* Tingkat selection - Radio buttons style */}
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ marginBottom: 10 }}>
                    Pilih Tingkat Capaian <span className="form-required">*</span>
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {TINGKAT_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                          background: currentTingkat === opt.value ? 'rgba(99,102,241,0.1)' : 'var(--bg-secondary)',
                          border: `1px solid ${currentTingkat === opt.value ? 'rgba(99,102,241,0.4)' : 'var(--glass-border)'}`,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          checked={currentTingkat === opt.value}
                          onChange={() => setValue(`jawaban.${index}.tingkat_capaian`, opt.value)}
                          style={{ marginTop: 3, accentColor: 'var(--primary)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                            {opt.label}
                          </div>
                          {currentTingkat === opt.value && (
                            <div style={{
                              fontSize: 12, color: 'var(--text-secondary)', marginTop: 4,
                              lineHeight: 1.5, animation: 'fadeIn 0.3s ease',
                            }}>
                              {opt.desc}
                            </div>
                          )}
                        </div>
                        {!opt.needBukti && (
                          <span style={{
                            marginLeft: 'auto', fontSize: 11, padding: '2px 8px', borderRadius: 4,
                            background: 'rgba(107,114,128,0.15)', color: 'var(--text-muted)',
                          }}>
                            Tanpa bukti
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Conditional Drive Link input */}
                {currentTingkat > 1 && (
                  <div style={{
                    padding: 16, borderRadius: 10, marginTop: 4,
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
                      Masukkan link Google Drive yang berisi dokumen bukti pendukung instansi Anda
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <div className="card" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', bottom: 20, backdropFilter: 'blur(10px)',
          background: 'rgba(26,34,53,0.95)', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              Pastikan semua jawaban dan bukti data dukung sudah benar sebelum submit.
            </p>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Menyimpan...
              </>
            ) : (
              '✅ Submit Evaluasi'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
