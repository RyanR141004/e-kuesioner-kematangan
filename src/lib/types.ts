// Database types

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'operator' | 'opd';
  nama_instansi: string;
  created_at: string;
  updated_at: string;
}

export interface VariabelEvaluasi {
  id: string;
  nama_variabel: string;
  deskripsi: string;
  urutan: number;
  link_petunjuk: string | null;
  created_at: string;
}

export interface Kelembagaan {
  id: string;
  nama: string;
  urutan: number;
}

export interface TransaksiEvaluasi {
  id: string;
  opd_id: string;
  periode_tahun: number;
  jenis_evaluasi: string;
  tanggal_submit: string;
  total_skor: number;
  level_kematangan: string;
  status: 'draft' | 'submitted' | 'reviewed';
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
  detail_jawaban?: DetailJawaban[];
}

export interface DetailJawaban {
  id: string;
  transaksi_id: string;
  variabel_id: string;
  tingkat_capaian: number;
  link_drive_dukung: string | null;
  created_at: string;
  // Joined fields
  variabel_evaluasi?: VariabelEvaluasi;
}

export interface KuesionerFormData {
  periode_tahun: number;
  jenis_evaluasi: string;
  jawaban: {
    variabel_id: string;
    tingkat_capaian: number;
    link_drive_dukung: string;
  }[];
}

export interface MaturityLevel {
  level: number;
  label: string;
  description: string;
  color: string;
  minScore: number;
  maxScore: number;
}
