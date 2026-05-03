import { createClient } from '@/lib/supabase/server';
import { calculateTotalScore, getMaturityLevelLabel } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { opd_id, periode_tahun, jenis_evaluasi, jawaban } = body;

    // Validate input
    if (!opd_id || !jawaban || !Array.isArray(jawaban) || jawaban.length === 0) {
      return NextResponse.json(
        { error: 'Data evaluasi tidak lengkap' },
        { status: 400 }
      );
    }

    // Validate each jawaban
    for (const j of jawaban) {
      if (!j.variabel_id || !j.tingkat_capaian) {
        return NextResponse.json(
          { error: 'Setiap variabel harus memiliki tingkat capaian' },
          { status: 400 }
        );
      }

      if (j.tingkat_capaian < 1 || j.tingkat_capaian > 5) {
        return NextResponse.json(
          { error: 'Tingkat capaian harus antara 1-5' },
          { status: 400 }
        );
      }

      // Validate URL for tingkat > 1
      if (j.tingkat_capaian > 1) {
        if (!j.link_drive_dukung) {
          return NextResponse.json(
            { error: 'Link Data Dukung wajib untuk Tingkat II ke atas' },
            { status: 400 }
          );
        }
        try {
          new URL(j.link_drive_dukung);
        } catch {
          return NextResponse.json(
            { error: `URL tidak valid: ${j.link_drive_dukung}` },
            { status: 400 }
          );
        }
      }
    }

    // Calculate maturity
    const scores = jawaban.map((j: any) => j.tingkat_capaian);
    const totalSkor = calculateTotalScore(scores);
    const levelKematangan = getMaturityLevelLabel(totalSkor);

    const supabase = await createClient();

    // Insert transaksi
    const { data: transaksi, error: transaksiError } = await supabase
      .from('transaksi_evaluasi')
      .insert({
        opd_id,
        periode_tahun: periode_tahun || new Date().getFullYear(),
        jenis_evaluasi: jenis_evaluasi || 'Evaluasi Manajemen SDM',
        total_skor: totalSkor,
        level_kematangan: levelKematangan,
        status: 'submitted',
      })
      .select()
      .single();

    if (transaksiError) {
      console.error('Transaksi error:', transaksiError);
      return NextResponse.json(
        { error: 'Gagal menyimpan transaksi: ' + transaksiError.message },
        { status: 500 }
      );
    }

    // Insert detail jawaban
    const detailData = jawaban.map((j: any) => ({
      transaksi_id: transaksi.id,
      variabel_id: j.variabel_id,
      tingkat_capaian: j.tingkat_capaian,
      link_drive_dukung: j.tingkat_capaian > 1 ? j.link_drive_dukung : null,
    }));

    const { error: detailError } = await supabase
      .from('detail_jawaban')
      .insert(detailData);

    if (detailError) {
      console.error('Detail error:', detailError);
      // Rollback transaksi
      await supabase.from('transaksi_evaluasi').delete().eq('id', transaksi.id);
      return NextResponse.json(
        { error: 'Gagal menyimpan detail jawaban: ' + detailError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transaksi_id: transaksi.id,
      total_skor: totalSkor,
      level_kematangan: levelKematangan,
      message: 'Evaluasi berhasil disimpan!',
    });
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    );
  }
}
