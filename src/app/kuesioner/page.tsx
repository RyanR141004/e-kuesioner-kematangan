'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { TINGKAT_OPTIONS } from '@/lib/utils';
import type { VariabelEvaluasi } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface FormValues {
  periode_tahun: number;
  jenis_evaluasi: string;
  jawaban: {
    variabel_id: string;
    nama_variabel: string;
    deskripsi: string;
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      periode_tahun: new Date().getFullYear(),
      jenis_evaluasi: 'Evaluasi Manajemen SDM',
      jawaban: [],
    },
  });

  const { fields } = useFieldArray({ control, name: 'jawaban' });

  useEffect(() => {
    fetchVariabel();
  }, []);

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
        urutan: v.urutan,
        tingkat_capaian: 1,
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
    // Validate URLs for tingkat > 1
    for (const j of data.jawaban) {
      if (j.tingkat_capaian > 1) {
        if (!j.link_drive_dukung || j.link_drive_dukung.trim() === '') {
          showToast('error', `Link Data Dukung wajib diisi untuk "${j.nama_variabel}" (Tingkat ${j.tingkat_capaian})`);
          return;
        }
        try {
          new URL(j.link_drive_dukung);
        } catch {
          showToast('error', `URL tidak valid untuk "${j.nama_variabel}". Pastikan format URL benar.`);
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
          periode_tahun: data.periode_tahun,
          jenis_evaluasi: data.jenis_evaluasi,
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

      showToast('success', `Evaluasi berhasil disimpan! Skor: ${result.total_skor} — ${result.level_kematangan}`);

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
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
        <h1 className="page-title">📝 Isi Kuesioner Evaluasi</h1>
        <p className="page-subtitle">
          Evaluasi Tingkat Kematangan SDM & Organisasi — {profile?.nama_instansi}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Periode & Jenis */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Periode Tahun</label>
              <select className="form-select" {...register('periode_tahun', { valueAsNumber: true })}>
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Jenis Evaluasi</label>
              <select className="form-select" {...register('jenis_evaluasi')}>
                <option value="Evaluasi Manajemen SDM">Evaluasi Manajemen SDM</option>
                <option value="Evaluasi Organisasi">Evaluasi Organisasi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
            Instrumen Evaluasi ({fields.length} Variabel)
          </h2>

          {fields.map((field, index) => {
            const currentTingkat = watchJawaban?.[index]?.tingkat_capaian ?? 1;

            return (
              <div key={field.id} className="q-item">
                <div className="q-title">
                  <span className="q-number">{index + 1}</span>
                  {field.nama_variabel}
                </div>
                {field.deskripsi && (
                  <p className="q-desc">{field.deskripsi}</p>
                )}

                <div style={{ marginTop: 16, marginLeft: 44 }}>
                  <label className="form-label">
                    Tingkat Capaian <span className="form-required">*</span>
                  </label>
                  <select
                    className="form-select"
                    {...register(`jawaban.${index}.tingkat_capaian`, { valueAsNumber: true })}
                  >
                    {TINGKAT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} — {opt.desc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Conditional Drive Link input */}
                {currentTingkat > 1 && (
                  <div className="q-drive-input">
                    <label className="form-label">
                      🔗 Link Google Drive Data Dukung <span className="form-required">*</span>
                    </label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://drive.google.com/..."
                      {...register(`jawaban.${index}.link_drive_dukung`)}
                    />
                    <p className="form-hint">
                      Masukkan link Google Drive yang berisi dokumen bukti pendukung
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
          background: 'rgba(26,34,53,0.95)',
        }}>
          <div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
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
