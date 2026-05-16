/**
 * Data Master E-Kuesioner Kematangan Perangkat Daerah
 * Berdasarkan Permendagri No 99 Tahun 2018
 * 
 * File ini berisi:
 * 1. Daftar 29 Kelembagaan
 * 2. 11 Instrumen Pertanyaan beserta kriteria level 1-5 dan syarat data dukung
 */

// =========================================================
// DAFTAR KELEMBAGAAN (29 Entitas)
// =========================================================
export const DAFTAR_KELEMBAGAAN = [
  "Sekretariat Daerah",
  "Badan Pendapatan Daerah",
  "Dinas Komunikasi dan Informatika",
  "Badan Perencanaan Pembangunan Daerah",
  "Dinas Lingkungan Hidup",
  "Dinas Tenaga Kerja, Penanaman Modal dan Pelayanan Terpadu Satu Pintu",
  "Dinas Perpustakaan Umum dan Arsip Daerah",
  "Dinas Kependudukan dan Pencatatan Sipil",
  "Satuan Polisi Pamong Praja",
  "Badan Kepegawaian dan Pengembangan SDM",
  "Dinas Kepemudaan, Olahraga, dan Pariwisata",
  "Dinas Kesehatan",
  "Dinas Perhubungan",
  "Dinas Koperasi, Perindustrian, dan Perdagangan",
  "Sekretariat DPRD",
  "Dinas Pekerjaan Umum, Penataan Ruang, Perumahan, dan Kawasan Permukiman",
  "Inspektorat Daerah",
  "Dinas Pendidikan dan Kebudayaan",
  "Dinas Ketahanan Pangan dan Pertanian",
  "Badan Keuangan dan Aset Daerah",
  "Kecamatan Klojen",
  "Kecamatan Kedungkandang",
  "Kecamatan Sukun",
  "Badan Kesatuan Bangsa dan Politik",
  "Dinas Sosial, Pemberdayaan Perempuan, Perlindungan Anak, Pengendalian Penduduk dan KB",
  "Kecamatan Blimbing",
  "Kecamatan Lowokwaru",
  "Bagian Organisasi",
  "Bagian Hukum",
] as const;

// =========================================================
// TIPE DATA
// =========================================================
export interface KriteriaLevel {
  deskripsi: string;
  syarat_data_dukung: string;
}

export interface InstrumenPertanyaan {
  id: number;
  soal: string;
  kriteria: {
    "1": KriteriaLevel;
    "2": KriteriaLevel;
    "3": KriteriaLevel;
    "4": KriteriaLevel;
    "5": KriteriaLevel;
  };
}

// =========================================================
// 11 INSTRUMEN PERTANYAAN
// Lengkap dengan kriteria Level 1-5 dan syarat data dukung
// =========================================================
export const INSTRUMEN_PERTANYAAN: InstrumenPertanyaan[] = [
  {
    id: 1,
    soal: "Bagaimana cara penentuan kegiatan yang diprioritaskan dalam perencanaan tahunan?",
    kriteria: {
      "1": {
        deskripsi: "Penentuan kegiatan diprioritaskan tanpa ada kriteria yang terukur.",
        syarat_data_dukung: "Tidak ada data dukung",
      },
      "2": {
        deskripsi: "Penentuan berdasarkan analisis terhadap hasil (outcome) yang akan dicapai.",
        syarat_data_dukung: "1. Berita Acara Pelaksanaan Forum OPD 2024\n2. Berita Acara Verifikasi rancangan Renja 2025",
      },
      "3": {
        deskripsi: "Penentuan berdasarkan analisis hasil dan kemampuan menghasilkan outcome.",
        syarat_data_dukung: "1. BA Pelaksanaan Forum OPD 2025\n2. BA Verifikasi Renja 2025\n3. Rancangan awal & akhir Renja 2025\n4. RKA murni & perubahan 2024\n5. Cascading 2025\n6. KAK / TOR kegiatan",
      },
      "4": {
        deskripsi: "Penentuan berdasarkan analisis komprehensif termasuk benchmarking dan evaluasi kinerja tahun sebelumnya.",
        syarat_data_dukung: "1. Dokumen pada Level 3\n2. Laporan Evaluasi Kinerja tahun sebelumnya\n3. Hasil benchmarking dengan daerah lain\n4. Dokumen review dan revisi prioritas",
      },
      "5": {
        deskripsi: "Penentuan terintegrasi dengan sistem perencanaan nasional, berbasis data real-time, dan dilakukan inovasi berkelanjutan.",
        syarat_data_dukung: "1. Dokumen pada Level 4\n2. Bukti integrasi dengan e-Planning nasional\n3. Dashboard monitoring real-time\n4. Laporan inovasi perencanaan\n5. Bukti kolaborasi lintas OPD",
      },
    },
  },
  {
    id: 2,
    soal: "Bagaimana proses penganggaran kegiatan dilakukan di organisasi?",
    kriteria: {
      "1": {
        deskripsi: "Proses penganggaran dilakukan tanpa mengacu pada standar biaya atau analisis kebutuhan.",
        syarat_data_dukung: "Tidak ada data dukung",
      },
      "2": {
        deskripsi: "Penganggaran sudah mengacu pada standar biaya dan Rencana Kerja Anggaran (RKA) disusun sesuai prosedur.",
        syarat_data_dukung: "1. RKA Murni Tahun Berjalan\n2. Standar Satuan Harga (SSH) yang digunakan",
      },
      "3": {
        deskripsi: "Penganggaran mengacu pada standar biaya, berbasis kinerja, dan telah terdokumentasi dengan baik.",
        syarat_data_dukung: "1. RKA Murni & Perubahan\n2. SSH & Standar Biaya Umum (SBU)\n3. Dokumen KAK/TOR seluruh kegiatan\n4. Analisis Standar Belanja (ASB)\n5. Cascading anggaran ke program",
      },
      "4": {
        deskripsi: "Penganggaran berbasis kinerja yang terukur dengan monitoring berkala dan evaluasi efisiensi anggaran.",
        syarat_data_dukung: "1. Dokumen pada Level 3\n2. Laporan monitoring penyerapan anggaran triwulan\n3. Hasil evaluasi efisiensi & efektivitas anggaran\n4. Dokumen reviu/audit internal anggaran",
      },
      "5": {
        deskripsi: "Penganggaran sudah terintegrasi digital, berbasis data analytics, dengan otomatisasi pelaporan dan inovasi berkelanjutan.",
        syarat_data_dukung: "1. Dokumen pada Level 4\n2. Bukti penggunaan e-Budgeting terintegrasi\n3. Dashboard analytics anggaran real-time\n4. Laporan inovasi efisiensi anggaran\n5. Sertifikat/penghargaan terkait penganggaran",
      },
    },
  },
  {
    id: 3,
    soal: "Bagaimana mekanisme pelaksanaan tugas dan fungsi sehari-hari?",
    kriteria: {
      "1": {
        deskripsi: "Pelaksanaan tugas dan fungsi berjalan tanpa ada SOP atau pedoman kerja yang jelas.",
        syarat_data_dukung: "Tidak ada data dukung",
      },
      "2": {
        deskripsi: "Pelaksanaan tugas sudah berdasarkan uraian tugas (job description) namun belum ada SOP formal.",
        syarat_data_dukung: "1. Dokumen uraian tugas/jabatan pegawai\n2. SK Pembagian Tugas",
      },
      "3": {
        deskripsi: "Pelaksanaan tugas sudah berdasarkan SOP yang terdokumentasi dan diterapkan secara konsisten.",
        syarat_data_dukung: "1. Dokumen SOP seluruh layanan/proses utama\n2. SK Penetapan SOP\n3. Bukti sosialisasi SOP kepada seluruh pegawai\n4. Dokumen Standar Pelayanan (SP)\n5. Laporan implementasi SOP",
      },
      "4": {
        deskripsi: "Pelaksanaan tugas terstandar, dimonitor pelaksanaannya, dan dievaluasi secara berkala.",
        syarat_data_dukung: "1. Dokumen pada Level 3\n2. Laporan monitoring pelaksanaan SOP\n3. Hasil evaluasi dan revisi SOP berkala\n4. Dokumen perbaikan berkelanjutan (continuous improvement)",
      },
      "5": {
        deskripsi: "Pelaksanaan tugas sudah terotomasi dengan sistem digital, berbasis data, dan terus berinovasi.",
        syarat_data_dukung: "1. Dokumen pada Level 4\n2. Bukti digitalisasi proses kerja/e-Office\n3. Dashboard monitoring kinerja pegawai real-time\n4. Laporan inovasi pelayanan\n5. Bukti penghargaan/sertifikasi terkait",
      },
    },
  },
  {
    id: 4,
    soal: "Bagaimana mekanisme penataan organisasi dan tata laksana?",
    kriteria: {
      "1": {
        deskripsi: "Struktur organisasi belum sesuai dengan beban kerja dan belum ada analisis jabatan.",
        syarat_data_dukung: "Tidak ada data dukung",
      },
      "2": {
        deskripsi: "Sudah ada struktur organisasi yang ditetapkan dan analisis jabatan sudah mulai dilakukan.",
        syarat_data_dukung: "1. Peraturan tentang Struktur Organisasi (SOTK)\n2. Dokumen awal Analisis Jabatan (Anjab)",
      },
      "3": {
        deskripsi: "Penataan organisasi berdasarkan analisis jabatan dan analisis beban kerja yang komprehensif.",
        syarat_data_dukung: "1. Dokumen Anjab lengkap seluruh jabatan\n2. Dokumen Analisis Beban Kerja (ABK)\n3. Peta Jabatan yang telah ditetapkan\n4. SK Penetapan Struktur Organisasi\n5. Evaluasi kelembagaan",
      },
      "4": {
        deskripsi: "Organisasi sudah adaptif, hasil evaluasi berkala ditindaklanjuti, dan tata kelola berjalan efektif.",
        syarat_data_dukung: "1. Dokumen pada Level 3\n2. Laporan evaluasi kelembagaan berkala\n3. Dokumen penyesuaian struktur berdasarkan evaluasi\n4. Hasil survey kepuasan internal",
      },
      "5": {
        deskripsi: "Organisasi agile, berbasis digital, dengan tata kelola yang terus berinovasi dan responsif terhadap perubahan.",
        syarat_data_dukung: "1. Dokumen pada Level 4\n2. Bukti implementasi e-Government/SPBE\n3. Dokumen transformasi digital organisasi\n4. Laporan inovasi tata kelola\n5. Penghargaan/pengakuan terkait",
      },
    },
  },
  {
    id: 5,
    soal: "Bagaimana sistem manajemen SDM aparatur diterapkan?",
    kriteria: {
      "1": {
        deskripsi: "Manajemen SDM belum terencana dan masih bersifat reaktif tanpa basis data kepegawaian.",
        syarat_data_dukung: "Tidak ada data dukung",
      },
      "2": {
        deskripsi: "Sudah ada perencanaan SDM dasar dan database kepegawaian mulai dikelola.",
        syarat_data_dukung: "1. Dokumen Bezetting Pegawai\n2. Data kepegawaian dasar (database/spreadsheet)",
      },
      "3": {
        deskripsi: "Manajemen SDM berbasis kompetensi, ada perencanaan kebutuhan, dan pengembangan karier terstruktur.",
        syarat_data_dukung: "1. Dokumen perencanaan kebutuhan ASN\n2. Standar kompetensi jabatan\n3. Rencana pengembangan karier pegawai\n4. Laporan Diklat/Bimtek pegawai\n5. Data SIMPEG yang terupdate",
      },
      "4": {
        deskripsi: "Manajemen SDM terukur, berbasis kinerja individu, dengan talent management dan succession planning.",
        syarat_data_dukung: "1. Dokumen pada Level 3\n2. Laporan SKP dan penilaian kinerja individu\n3. Dokumen talent pool dan succession planning\n4. Evaluasi efektivitas program pengembangan SDM",
      },
      "5": {
        deskripsi: "Manajemen SDM sudah terintegrasi digital, prediktif, dengan budaya kerja inovatif dan kolaboratif.",
        syarat_data_dukung: "1. Dokumen pada Level 4\n2. Bukti HRIS/e-Kinerja terintegrasi\n3. Dashboard analytics SDM\n4. Laporan budaya kerja dan engagement\n5. Penghargaan/sertifikasi SDM",
      },
    },
  },
  {
    id: 6,
    soal: "Bagaimana sistem pengelolaan keuangan dan aset daerah?",
    kriteria: {
      "1": {
        deskripsi: "Pengelolaan keuangan belum teratur dan belum sesuai standar akuntansi pemerintahan.",
        syarat_data_dukung: "Tidak ada data dukung",
      },
      "2": {
        deskripsi: "Pengelolaan keuangan sudah mengacu pada regulasi dan ada pelaporan keuangan periodik.",
        syarat_data_dukung: "1. Laporan Keuangan Semester/Tahunan\n2. Bukti penggunaan SIMDA/SIPD Keuangan",
      },
      "3": {
        deskripsi: "Pengelolaan keuangan transparan, akuntabel, dengan pengendalian internal yang memadai.",
        syarat_data_dukung: "1. Laporan Keuangan OPD yang teraudit\n2. Laporan Aset/BMD yang terupdate\n3. SOP Pengelolaan Keuangan\n4. Dokumen Sistem Pengendalian Internal (SPI)\n5. Bukti rekonsiliasi aset berkala",
      },
      "4": {
        deskripsi: "Pengelolaan keuangan berbasis kinerja, efisien, dan hasil audit menunjukkan opini WTP.",
        syarat_data_dukung: "1. Dokumen pada Level 3\n2. Bukti opini WTP/WDP dari BPK\n3. Laporan tindak lanjut temuan audit\n4. Analisis efisiensi belanja",
      },
      "5": {
        deskripsi: "Pengelolaan keuangan terintegrasi digital, berbasis data analytics, dan menjadi best practice.",
        syarat_data_dukung: "1. Dokumen pada Level 4\n2. Bukti e-Budgeting & e-Procurement terintegrasi\n3. Dashboard keuangan real-time\n4. Laporan inovasi pengelolaan keuangan\n5. Penghargaan terkait pengelolaan keuangan",
      },
    },
  },
  {
    id: 7,
    soal: "Bagaimana mekanisme pengawasan dan pengendalian internal?",
    kriteria: {
      "1": {
        deskripsi: "Pengawasan dilakukan secara informal tanpa ada sistem pengendalian internal yang jelas.",
        syarat_data_dukung: "Tidak ada data dukung",
      },
      "2": {
        deskripsi: "Sudah ada unit pengawasan dan mekanisme pengendalian dasar sudah terbentuk.",
        syarat_data_dukung: "1. SK Tim/Unit Pengawasan Internal\n2. Rencana kerja pengawasan tahunan",
      },
      "3": {
        deskripsi: "Sistem Pengendalian Internal Pemerintah (SPIP) sudah diterapkan secara formal dan terdokumentasi.",
        syarat_data_dukung: "1. SK Penyelenggaraan SPIP\n2. Peta Risiko dan Register Risiko\n3. Laporan Penyelenggaraan SPIP\n4. Laporan hasil audit internal\n5. Rencana tindak pengendalian",
      },
      "4": {
        deskripsi: "SPIP berjalan efektif, temuan audit ditindaklanjuti, dan ada evaluasi maturitas SPIP secara berkala.",
        syarat_data_dukung: "1. Dokumen pada Level 3\n2. Laporan evaluasi maturitas SPIP\n3. Bukti tindak lanjut seluruh temuan\n4. Laporan monitoring efektivitas pengendalian",
      },
      "5": {
        deskripsi: "Pengawasan berbasis teknologi, prediktif, dan menjadi budaya organisasi dengan zero tolerance fraud.",
        syarat_data_dukung: "1. Dokumen pada Level 4\n2. Bukti e-Audit/sistem pengawasan digital\n3. Whistleblowing system yang aktif\n4. Laporan integritas dan anti-korupsi\n5. Sertifikasi/penghargaan terkait",
      },
    },
  },
  {
    id: 8,
    soal: "Bagaimana pelaksanaan pelayanan publik di organisasi?",
    kriteria: {
      "1": {
        deskripsi: "Pelayanan publik belum terstandar dan belum ada mekanisme pengaduan masyarakat.",
        syarat_data_dukung: "Tidak ada data dukung",
      },
      "2": {
        deskripsi: "Sudah ada standar pelayanan dasar dan mulai tersedia saluran pengaduan.",
        syarat_data_dukung: "1. Dokumen Standar Pelayanan (SP)\n2. Bukti ketersediaan saluran pengaduan",
      },
      "3": {
        deskripsi: "Pelayanan publik terstandar, transparan, dan sudah ada Survey Kepuasan Masyarakat (SKM).",
        syarat_data_dukung: "1. SK Penetapan Standar Pelayanan\n2. Maklumat Pelayanan\n3. Laporan Survey Kepuasan Masyarakat (SKM)\n4. SOP seluruh jenis layanan\n5. Bukti pengelolaan pengaduan/feedback",
      },
      "4": {
        deskripsi: "Pelayanan responsif, inovatif, dan hasil SKM menunjukkan indeks kepuasan tinggi.",
        syarat_data_dukung: "1. Dokumen pada Level 3\n2. Laporan SKM dengan indeks ≥ 80/Baik\n3. Dokumentasi inovasi pelayanan\n4. Bukti tindak lanjut hasil SKM",
      },
      "5": {
        deskripsi: "Pelayanan berbasis digital (e-Service), terintegrasi, dan menjadi role model pelayanan prima.",
        syarat_data_dukung: "1. Dokumen pada Level 4\n2. Bukti layanan online/e-Service terintegrasi\n3. Dashboard pelayanan real-time\n4. Penghargaan pelayanan publik\n5. Bukti replikasi oleh OPD lain",
      },
    },
  },
  {
    id: 9,
    soal: "Bagaimana penerapan sistem informasi dan teknologi dalam mendukung kinerja organisasi?",
    kriteria: {
      "1": {
        deskripsi: "Penggunaan teknologi informasi masih sangat minim dan belum ada rencana pengembangan TI.",
        syarat_data_dukung: "Tidak ada data dukung",
      },
      "2": {
        deskripsi: "Sudah ada infrastruktur TI dasar dan beberapa aplikasi sudah digunakan secara parsial.",
        syarat_data_dukung: "1. Daftar inventaris infrastruktur TI\n2. Daftar aplikasi/sistem informasi yang digunakan",
      },
      "3": {
        deskripsi: "Sudah ada rencana induk TI (IT Master Plan), sistem informasi terintegrasi, dan tata kelola TI berjalan.",
        syarat_data_dukung: "1. Dokumen Rencana Induk TI / SPBE\n2. Laporan Evaluasi SPBE\n3. SOP Tata Kelola TI\n4. Bukti integrasi antar sistem informasi\n5. Laporan keamanan informasi",
      },
      "4": {
        deskripsi: "TI sudah menjadi enabler kinerja organisasi, berbasis data, dan ada manajemen risiko TI.",
        syarat_data_dukung: "1. Dokumen pada Level 3\n2. Dashboard data analytics organisasi\n3. Dokumen manajemen risiko TI\n4. Laporan monitoring ketersediaan sistem (uptime)",
      },
      "5": {
        deskripsi: "Transformasi digital menyeluruh, Smart Governance, dan inovasi teknologi berkelanjutan.",
        syarat_data_dukung: "1. Dokumen pada Level 4\n2. Bukti implementasi Smart City/Governance\n3. Bukti AI/Big Data/IoT dalam pelayanan\n4. Penghargaan SPBE/inovasi digital\n5. Bukti kolaborasi TI lintas OPD/daerah",
      },
    },
  },
  {
    id: 10,
    soal: "Bagaimana sistem akuntabilitas kinerja instansi pemerintah (SAKIP) diterapkan?",
    kriteria: {
      "1": {
        deskripsi: "Belum ada perencanaan kinerja yang terstruktur dan pelaporan kinerja belum rutin.",
        syarat_data_dukung: "Tidak ada data dukung",
      },
      "2": {
        deskripsi: "Sudah ada Renstra, Renja, dan Perjanjian Kinerja namun belum terukur dan terintegrasi.",
        syarat_data_dukung: "1. Dokumen Renstra OPD\n2. Dokumen Perjanjian Kinerja (PK) tahun berjalan",
      },
      "3": {
        deskripsi: "SAKIP sudah berjalan dengan baik, ada cascading kinerja, dan LKJIP disusun secara komprehensif.",
        syarat_data_dukung: "1. Renstra OPD 2024-2026\n2. Perjanjian Kinerja (PK)\n3. Rencana Aksi pencapaian kinerja\n4. LKJIP / LKj OPD tahun sebelumnya\n5. Pohon Kinerja dan cascading IKU",
      },
      "4": {
        deskripsi: "SAKIP berjalan efektif, hasil evaluasi SAKIP minimal nilai 'B', dan kinerja terukur secara komprehensif.",
        syarat_data_dukung: "1. Dokumen pada Level 3\n2. Hasil evaluasi SAKIP minimal nilai B\n3. Laporan monitoring capaian kinerja triwulan\n4. Dokumen review dan perbaikan indikator kinerja",
      },
      "5": {
        deskripsi: "SAKIP sudah best practice, berbasis digital e-SAKIP, terintegrasi, dan mendapat nilai 'A'.",
        syarat_data_dukung: "1. Dokumen pada Level 4\n2. Bukti e-SAKIP/e-Kinerja yang terintegrasi\n3. Dashboard capaian kinerja real-time\n4. Hasil evaluasi SAKIP nilai A\n5. Penghargaan/pengakuan nasional terkait SAKIP",
      },
    },
  },
  {
    id: 11,
    soal: "Bagaimana upaya peningkatan kapasitas dan inovasi organisasi?",
    kriteria: {
      "1": {
        deskripsi: "Belum ada program pengembangan kapasitas yang terencana dan inovasi belum menjadi prioritas.",
        syarat_data_dukung: "Tidak ada data dukung",
      },
      "2": {
        deskripsi: "Sudah ada pelatihan/Bimtek untuk pegawai namun belum terencana secara sistematis.",
        syarat_data_dukung: "1. Daftar pelatihan/Bimtek yang telah diikuti pegawai\n2. Surat tugas/sertifikat pelatihan",
      },
      "3": {
        deskripsi: "Program pengembangan kapasitas sudah terencana, ada Knowledge Management, dan inovasi mulai didorong.",
        syarat_data_dukung: "1. Rencana pengembangan kompetensi (HCD Plan)\n2. Laporan pelaksanaan Diklat/Bimtek\n3. Dokumen Knowledge Management/sharing\n4. Proposal inovasi yang diajukan\n5. Bukti partisipasi kompetisi inovasi",
      },
      "4": {
        deskripsi: "Learning organization terbentuk, inovasi sudah diterapkan, dan ada budaya perbaikan berkelanjutan.",
        syarat_data_dukung: "1. Dokumen pada Level 3\n2. Bukti implementasi inovasi dan dampaknya\n3. Laporan budaya inovasi (innovation culture)\n4. Dokumentasi lesson learned dan best practice",
      },
      "5": {
        deskripsi: "Organisasi menjadi benchmark nasional, inovasi berkelanjutan, dan berkolaborasi aktif dalam jejaring pengetahuan.",
        syarat_data_dukung: "1. Dokumen pada Level 4\n2. Penghargaan inovasi tingkat nasional\n3. Bukti replikasi inovasi oleh daerah lain\n4. Dokumentasi kolaborasi jejaring pengetahuan\n5. Bukti publikasi ilmiah/media",
      },
    },
  },
];
