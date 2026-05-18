/**
 * Data Master E-Kuesioner Kematangan Perangkat Daerah
 * Berdasarkan Permendagri No 99 Tahun 2018
 *
 * SINGLE SOURCE OF TRUTH untuk merender kuesioner.
 * Berisi 28 Kelembagaan + 11 Instrumen Pertanyaan lengkap
 * dengan link_drive_master, kriteria level 1-5, dan panduan data dukung.
 */

// =========================================================
// DAFTAR KELEMBAGAAN (28 Entitas)
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
  "Bagian Hukum",
] as const;

// =========================================================
// TIPE DATA
// =========================================================
export interface KriteriaLevel {
  deskripsi: string;
  butuh_bukti: boolean;
  panduan?: string;
}

export interface InstrumenPertanyaan {
  id: number;
  soal: string;
  link_drive_master: string;
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
// =========================================================
export const INSTRUMEN_PERTANYAAN: InstrumenPertanyaan[] = [
  {
    id: 1,
    soal: "1. Bagaimana cara penentuan kegiatan yang diprioritaskan dalam perencanaan tahunan?",
    link_drive_master: "https://drive.google.com/drive/folders/1zBT-bbXPy14tW7NHKI-w4j-DTlLAWL7N?usp=sharing",
    kriteria: {
      "1": { deskripsi: "Penentuan kegiatan diprioritaskan dalam dokumen perencanaan tahunan (Renja/RKPD) dilakukan tanpa ada kriteria yang terukur.", butuh_bukti: false },
      "2": { deskripsi: "Penentuan kegiatan yang diprioritaskan berdasarkan analisis terhadap hasil (outcome) apa yang akan dicapai kegiatan tersebut.", butuh_bukti: true, panduan: "Berita Acara Pelaksanaan Forum OPD 2024, Berita Acara Verifikasi rancangan Renja 2025" },
      "3": { deskripsi: "Penentuan prioritas kegiatan dilakukan berdasarkan analisis hasil (outcome) dan analisis kemampuan kegiatan menghasilkan hasil (outcome).", butuh_bukti: true, panduan: "Berita Acara Pelaksanaan Forum OPD 2025, Berita Acara Verifikasi Renja 2025, Rancangan awal & akhir renja 2025 OPD, RKA murni & perubahan 2024, Cascading 2025, KAK / TOR kegiatan" },
      "4": { deskripsi: "Penentuan prioritas kegiatan dilakukan berdasarkan analisis yang membandingkan hasil (outcome) yang akan dicapai antara satu alternatif kegiatan dengan alternatif kegiatan yang lain.", butuh_bukti: true, panduan: "BA Forum OPD 2025, BA Verifikasi Renja 2025, Rancangan awal/akhir Renja 2025, RKA murni/perubahan 2024, Cascading 2024, KAK/TOR, Rencana aksi kegiatan 2025" },
      "5": { deskripsi: "Penentuan prioritas kegiatan dalam dokumen tahunan dilakukan dengan perbandingan hasil (outcome) antara satu alternatif kegiatan dengan alternatif kegiatan yang lain dan dibantu dengan teknologi informasi.", butuh_bukti: true, panduan: "BA Forum OPD 2025, BA Verifikasi Renja 2025, Rancangan awal/akhir Renja 2025, RKA murni/perubahan 2024, Cascading 2023, KAK/TOR, Rencana aksi kegiatan 2025, Screenshot e-planning & e-budgeting" },
    },
  },
  {
    id: 2,
    soal: "2. Bagaimana metode pengendalian program kegiatan dilakukan di perangkat daerah?",
    link_drive_master: "https://drive.google.com/drive/folders/1SqyrgktMRziL9fSUCveR10vZdQQPIHue?usp=sharing",
    kriteria: {
      "1": { deskripsi: "Monitoring dan pengendalian dilakukan dengan cara sederhana dan tidak terstruktur.", butuh_bukti: false },
      "2": { deskripsi: "Monitoring dan pengendalian dilakukan secara berkala dengan fokus yang ditentukan.", butuh_bukti: true, panduan: "Rapat internal / rapat staf tentang monev pelaksanaan program kegiatan (undangan dan notulen rapat)" },
      "3": { deskripsi: "Monitoring dan pengendalian dilakukan secara berkala dengan kriteria penyimpangan yang terstandarisasi pada setiap kegiatan.", butuh_bukti: true, panduan: "Rapat internal/staf monev, Jadwal monev berkala program kegiatan (triwulanan)" },
      "4": { deskripsi: "Monitoring dan pengendalian dilakukan secara berkala dengan kriteria penyimpangan yang terstandarisasi dan diikuti dengan umpan balik berupa perbaikan yang terdokumentasi dengan baik.", butuh_bukti: true, panduan: "Rapat internal monev, Jadwal monev, Laporan fisik keuangan triwulanan ke BKAD, Laporan RKPD triwulanan ke Bappeda, Bahan rapat pengendalian/PPT paparan realisasi" },
      "5": { deskripsi: "Monitoring dan pengendalian dilakukan secara sistematis, terstandarisasi termasuk umpan balik yang didukung oleh penggunaan teknologi informasi berbasis internet.", butuh_bukti: true, panduan: "Rapat internal monev, Jadwal monev triwulanan, Laporan fisik keuangan ke BKAD, Laporan RKPD ke Bappeda, Bahan rapat pengendalian, Aplikasi monitoring berbasis internet" },
    },
  },
  {
    id: 3,
    soal: "3. Bagaimana proses penjaminan mutu dilakukan di perangkat daerah?",
    link_drive_master: "https://drive.google.com/drive/folders/1EqlQzuuYLnoFPYeKccJ46juJooOAvI5F?usp=sharing",
    kriteria: {
      "1": { deskripsi: "Tidak ada penjaminan mutu atas produk yang dihasilkan dan atas proses kerja yang dilakukan.", butuh_bukti: false },
      "2": { deskripsi: "Penjaminan mutu produk dan proses kerja dilakukan secara berkala namun tidak mempunyai standar mutu produk dan proses yang ditetapkan.", butuh_bukti: true, panduan: "Proses pelayanan dengan jenjang verifikasi (contoh surat / nota dinas yang menunjukkan adanya paraf pejabat struktural)" },
      "3": { deskripsi: "Mutu produk dan proses sudah distandarisasi dan dilakukan pengujian secara berkala secara internal.", butuh_bukti: true, panduan: "Contoh surat/nota dinas dengan paraf struktural, Dokumen Standar Pelayanan, SK Tim Mutu / SK Tim Monev Standar Pelayanan, Berita Acara Monev Standar Pelayanan" },
      "4": { deskripsi: "Penjaminan mutu produk dan proses sudah distandarisasi serta dilakukan pengukuran/ pengujian secara berkala oleh tenaga yang bersertifikat.", butuh_bukti: true, panduan: "Contoh surat/nota dinas paraf struktural, Dokumen Standar Pelayanan, SK Tim Mutu, Berita Acara Monev, Dokumen Sistem Manajemen Mutu/Akreditasi/ISO, SK/Surat Tugas keterlibatan tenaga ahli eksternal" },
      "5": { deskripsi: "Penjaminan mutu produk dan proses dilakukan terstandarisasi dan berkala oleh tenaga ahli bersertifikat serta didukung oleh teknologi informasi berbasis internet.", butuh_bukti: true, panduan: "Dokumen Standar Pelayanan, SK Tim Mutu, Berita Acara Monev, Dokumen ISO, SK Tenaga Ahli, Website Perangkat Daerah yang memuat tentang SP dan sertifikat/piagam penjaminan mutu/ISO" },
    },
  },
  {
    id: 4,
    soal: "4. Sejauh mana pengelolaan SOP di perangkat daerah anda?",
    link_drive_master: "https://drive.google.com/drive/folders/1lquyRnkB6YRtbLZaYElv9iys504UNZmd?usp=sharing",
    kriteria: {
      "1": { deskripsi: "Tidak ada definisi resmi proses pelaksanaan pekerjaan pada perangkat daerah.", butuh_bukti: false },
      "2": { deskripsi: "Definisi proses organisasi sudah dituangkan dalam standar operasi prosedur (SOP).", butuh_bukti: true, panduan: "SK Tim Penyusun SOP Perangkat Daerah terbaru, Dokumen SOP Perangkat Daerah terbaru" },
      "3": { deskripsi: "Definisi proses organisasi sudah dituangkan ke dalam SOP dan telah dilakukan evaluasi berkala terhadap penerapan SOP.", butuh_bukti: true, panduan: "SK Tim Penyusun SOP terbaru, Dokumen SOP terbaru, Berita Acara Monev SOP terbaru" },
      "4": { deskripsi: "Definisi proses organisasi sudah dituangkan dalam SOP, sudah dievaluasi secara berkala dan dilakukan tindak lanjut terhadap hasil evaluasi penerapan SOP berupa tindakan koreksi atau perbaikan SOP.", butuh_bukti: true, panduan: "SK Tim Penyusun SOP, Dokumen SOP, Berita Acara Monev SOP, SK tentang Perubahan SOP, Dokumen SOP terbaru pasca perubahan" },
      "5": { deskripsi: "Definisi proses organisasi sudah dituangkan dalam SOP dan sudah dilakukan evaluasi serta tindak lanjut, kemudian disesuaikan dengan kebutuhan/keluhan pelanggan serta didukung oleh teknologi berbasis internet.", butuh_bukti: true, panduan: "SK Tim Penyusun SOP, Dokumen SOP, Berita Acara Monev, SK Perubahan SOP, Dokumen SOP pasca perubahan, Website Perangkat Daerah yang menampilkan informasi SOP" },
    },
  },
  {
    id: 5,
    soal: "5. Bagaimana rencana pengembangan kompetensi pegawai di perangkat daerah anda?",
    link_drive_master: "https://drive.google.com/drive/folders/1T9fimaeggxgKA5q_Mj2BCwsf5kQPFEoo?usp=sharing",
    kriteria: {
      "1": { deskripsi: "Belum ada dokumen resmi rencana kebutuhan pendidikan dan pelatihan pada perangkat daerah yang bersangkutan.", butuh_bukti: false },
      "2": { deskripsi: "Dokumen rencana kebutuhan pengembangan pegawai sudah tersusun secara parsial untuk jabatan tertentu.", butuh_bukti: true, panduan: "Surat Usulan Pengembangan Kompetensi dari Kepala Perangkat Daerah ke Kepala BKPSDM tahun terbaru" },
      "3": { deskripsi: "Dokumen rencana kebutuhan pengembangan pegawai disusun untuk seluruh jabatan.", butuh_bukti: true, panduan: "Surat Usulan Pengembangan Kompetensi ke BKPSDM, Lampiran Surat Usulan, Rekap Kebutuhan Diklat per Jabatan" },
      "4": { deskripsi: "Rencana pengembangan pegawai dievaluasi secara regular dan seluruh pengembangan pegawai sudah dilaksanakan sesuai dengan dokumen rencana pengembangan pegawai yang sudah ditetapkan.", butuh_bukti: true, panduan: "Surat Usulan Pengembangan Kompetensi, Lampiran Surat Usulan, Rekap Kebutuhan Diklat per Jabatan, Dokumen rencana pengembangan pegawai resmi" },
      "5": { deskripsi: "Hasil (outcome) pengembangan pegawai dievaluasi secara regular sebagai umpan balik.", butuh_bukti: true, panduan: "Surat Usulan Pengembangan Kompetensi beserta Lampiran, Rekap Kebutuhan Diklat, Dokumen rencana pengembangan, Undangan + Daftar Hadir + Notulen rapat evaluasi pelaksanaan diklat" },
    },
  },
  {
    id: 6,
    soal: "6. Bagaimana proses analisis kebijakan di perangkat daerah Anda?",
    link_drive_master: "https://drive.google.com/drive/folders/1rlnPKFG_bwR_pQ4HMkVAdbNnjMO1d3OB?usp=sharing",
    kriteria: {
      "1": { deskripsi: "Analisis kebijakan dan pemecahan masalah dilakukan secara sederhana dan dengan metode yang tidak terukur.", butuh_bukti: false },
      "2": { deskripsi: "Analisis kebijakan yang berdampak ke publik dilakukan oleh tim internal perangkat daerah yang bersangkutan.", butuh_bukti: true, panduan: "SK Tim Analisis / Tim Kebijakan / Tim Pelaksana Kegiatan Perangkat Daerah terbaru" },
      "3": { deskripsi: "Analisis kebijakan dan pemecahan masalah yang berdampak ke publik dilakukan menggunakan metode/teknik ilmiah oleh tim internal dengan melibatkan instansi pemerintah terkait.", butuh_bukti: true, panduan: "SK Tim Analisis/Kebijakan Perangkat Daerah, Undangan rapat Tim Analisis, Notulen rapat Tim" },
      "4": { deskripsi: "Analisis kebijakan dan pemecahan masalah yang bersifat strategis/berdampak ke publik melibatkan tim ahli.", butuh_bukti: true, panduan: "SK Tim Analisis/Kebijakan, Undangan rapat Tim, Notulen rapat Tim, SK atau surat tugas yang menunjukkan keterlibatan narasumber dari pihak eksternal / ahli" },
      "5": { deskripsi: "Analisis kebijakan dan pemecahan masalah strategis/berdampak ke publik melibatkan tim ahli dengan melakukan konsultasi publik dan analisis umpan balik yang terukur dan terdokumentasi.", butuh_bukti: true, panduan: "SK Tim Analisis, Undangan & Notulen rapat Tim, SK keterlibatan narasumber eksternal, Undangan public hearing, Notulen kegiatan public hearing" },
    },
  },
  {
    id: 7,
    soal: "7. Bagaimana pengelolaan sumber daya dalam pelaksanaan proyek di perangkat daerah anda?",
    link_drive_master: "https://drive.google.com/drive/folders/1b7XGQhyS9t_vBNQlHZpfnJPnh9ceIc95?usp=sharing",
    kriteria: {
      "1": { deskripsi: "Penggunaan sumber daya dilakukan hanya berdasarkan ketentuan formal yang berlaku.", butuh_bukti: false },
      "2": { deskripsi: "Penentuan penggunaan input proyek dilakukan berdasarkan analisis kebutuhan bahan/ sumber daya yang sudah ditetapkan.", butuh_bukti: true, panduan: "Perwal tentang Standar Harga Satuan Tahun Anggaran terbaru" },
      "3": { deskripsi: "Analisis kebutuhan input/sumber daya proyek sudah distandarisasi dengan proses ujicoba secara terbuka dan menggunakan metode ilmiah.", butuh_bukti: true, panduan: "Perwal tentang Standar Harga Satuan, Salah satu contoh RKA kegiatan Tahun berkenaan" },
      "4": { deskripsi: "Penyediaan sumber daya dalam pelaksanaan proyek dimonitor secara ketat berdasarkan standar input sumber daya, SOP dan prosedur penjaminan mutu produk.", butuh_bukti: true, panduan: "Perwal Standar Harga Satuan, Contoh RKA kegiatan, Usulan data kebutuhan pegawai dan bezeting ke Kepala BKPSDM" },
      "5": { deskripsi: "Penyediaan sumber daya dan pelaksanaan proyek dimonitor secara ketat berdasarkan SOP dan prosedur penjaminan mutu produk dan didukung oleh teknologi informasi berbasis internet.", butuh_bukti: true, panduan: "Perwal Standar Harga Satuan, Contoh RKA, Usulan kebutuhan pegawai/bezeting & peta jabatan terbaru ke BKPSDM, Screenshot e-budgeting, e-formasi, e-procurement" },
    },
  },
  {
    id: 8,
    soal: "8. Bagaimana pengelolaan risiko dalam tugas perangkat daerah Anda?",
    link_drive_master: "https://drive.google.com/drive/folders/1D08sAaS31MVTStR8p6OMRB2rgxTTAcKY?usp=sharing",
    kriteria: {
      "1": { deskripsi: "Belum ada manajemen resiko dalam pelaksanaan tugas pada perangkat daerah.", butuh_bukti: false },
      "2": { deskripsi: "Sudah ada sebagian pegawai yang melakukan analisis resiko dalam pelaksanaan tugasnya, namun hanya bersifat individu.", butuh_bukti: true, panduan: "SK Satgas RTP Perangkat Daerah, Tabel risiko internal (tanpa dokumen laporan lengkap)" },
      "3": { deskripsi: "Perangkat daerah sudah menetapkan prosedur pengelolaan resiko dalam pelaksanaan tugas tertentu yang dipandang mempunyai resiko tinggi.", butuh_bukti: true, panduan: "SK Satgas RTP Perangkat Daerah, Dokumen / Laporan RTP (Rencana Tindak Pengendalian) Perangkat Daerah" },
      "4": { deskripsi: "Perangkat daerah sudah menetapkan prosedur pengelolaan resiko untuk seluruh tugas pada perangkat daerah yang bersangkutan, namun belum dilakukan evaluasi secara berkala.", butuh_bukti: true, panduan: "SK Satgas RTP Perangkat Daerah, Dokumen / Laporan RTP Perangkat Daerah, Bukti rapat monev RTP (undangan dan notulen rapat)" },
      "5": { deskripsi: "Perangkat Daerah sudah menetapkan prosedur pengelolaan resiko dalam pelaksanaan tugas serta semua resiko dapat dikendalikan tanpa ada kerugian baik bagi pegawai maupun instansi.", butuh_bukti: true, panduan: "SK Satgas RTP, Dokumen/Laporan RTP Perangkat Daerah, Rapat monev RTP (undangan & notulen), SK tentang Satgas SPIP (Sistem Pengendalian Intern Pemerintah) Perangkat Daerah" },
    },
  },
  {
    id: 9,
    soal: "9. Bagaimana pengukuran kinerja di perangkat daerah Anda?",
    link_drive_master: "https://drive.google.com/drive/folders/1rBJbdvII807-Fs9cvo71DOYOi4mC1Kbf?usp=sharing",
    kriteria: {
      "1": { deskripsi: "Belum ada target/rencana kinerja perangkat daerah yang terukur.", butuh_bukti: false },
      "2": { deskripsi: "Sudah ada target kinerja perangkat daerah, tapi belum konsisten mengacu dokumen perencanaan daerah.", butuh_bukti: true, panduan: "Perjanjian Kinerja (PK) murni dan Perjanjian Kinerja perubahan Tahun terbaru" },
      "3": { deskripsi: "Sudah ada target kinerja perangkat daerah yang konsisten dengan dokumen perencanaan.", butuh_bukti: true, panduan: "Perjanjian Kinerja murni & perubahan Tahun terbaru, DPA murni & perubahan Tahun terbaru" },
      "4": { deskripsi: "Target kinerja perangkat daerah sudah dilakukan pengukuran pencapaiannya.", butuh_bukti: true, panduan: "Perjanjian Kinerja murni/perubahan, DPA murni/perubahan, Laporan capaian kinerja triwulanan Tahun berjalan" },
      "5": { deskripsi: "Pencapaian target kinerja perangkat daerah sudah diukur dan sudah tercapai dengan baik (di atas 90 %) serta telah dilakukan evaluasi pencapaian target kinerja serta didukung dengan teknologi informasi.", butuh_bukti: true, panduan: "Perjanjian Kinerja murni/perubahan, DPA murni/perubahan, Laporan capaian kinerja triwulanan, Screenshot sistem e-kinerja kepala Perangkat Daerah" },
    },
  },
  {
    id: 10,
    soal: "10. Bagaimana perangkat daerah Anda mengembangkan inovasi?",
    link_drive_master: "https://drive.google.com/drive/folders/14NcO4U9TiImABrc2xPABMWnEng3SswPu?usp=sharing",
    kriteria: {
      "1": { deskripsi: "Belum ada rencana pengembangan produk yang akan dilakukan secara sistematis.", butuh_bukti: false },
      "2": { deskripsi: "Pengembangan produk dilakukan dengan mengadopsi inovasi yang dikembangkan oleh daerah lain (replikasi inovasi).", butuh_bukti: true, panduan: "Proposal inovasi OPD, Screenshot aplikasi atau foto ruang/fasilitas hasil inovasi" },
      "3": { deskripsi: "Telah disusun rencana pengembangan inovasi baik jenis, mutu maupun metodenya.", butuh_bukti: true, panduan: "Proposal inovasi OPD, Screenshot aplikasi/foto ruang inovasi, Bukti pengembangan aplikasi / maintenance (integrasi sistem atau pengembangan versi)" },
      "4": { deskripsi: "Telah ada inovasi yang dikembangkan sendiri oleh perangkat daerah yang bersangkutan.", butuh_bukti: true, panduan: "Proposal inovasi OPD, Screenshot aplikasi/foto hasil inovasi, Bukti maintenance/pengembangan versi, Surat Pernyataan Kepala Perangkat Daerah bahwa inovasi dikembangkan sendiri" },
      "5": { deskripsi: "Perangkat daerah sudah mempunyai program pengkajian dan inovasi secara terencana dan berkelanjutan.", butuh_bukti: true, panduan: "Proposal inovasi, Screenshot aplikasi/foto inovasi, Bukti maintenance, Surat Pernyataan Mandiri, SK Tim Inovasi Pelayanan Publik, Rencana kerja Tim pengembangan inovasi" },
    },
  },
  {
    id: 11,
    soal: "11. Bagaimana penerapan budaya organisasi di perangkat daerah Anda?",
    link_drive_master: "https://drive.google.com/drive/folders/1vqsQUXmrGa0hYwI6flIHXNeGG2y0NPo0?usp=sharing",
    kriteria: {
      "1": { deskripsi: "Belum ada budaya organisasi pada perangkat daerah.", butuh_bukti: false },
      "2": { deskripsi: "Sudah ada slogan-slogan yang menggambarkan nilai organisasi pada perangkat daerah yang bersangkutan.", butuh_bukti: true, panduan: "Dokumentasi foto/video atau visualisasi banner nilai budaya organisasi di kantor" },
      "3": { deskripsi: "Sudah ada dokumen budaya organisasi yang resmi menggambarkan nilai-nilai, sikap dan perilaku di perangkat daerah yang bersangkutan.", butuh_bukti: true, panduan: "Dokumentasi/visualisasi nilai budaya, Keputusan Kepala Perangkat Daerah tentang moto, nilai budaya kerja, dan janji layanan" },
      "4": { deskripsi: "Sudah ada program internalisasi budaya organisasi yang berkelanjutan berdasarkan dokumen resmi.", butuh_bukti: true, panduan: "Dokumentasi visual nilai budaya, Keputusan Kepala Perangkat Daerah tentang janji layanan, Dokumen kertas kerja budaya kerja, Dokumen rencana program implementasi & evaluasi ditandatangani Kepala PD" },
      "5": { deskripsi: "Budaya organisasi sudah tercermin dalam sikap dan perilaku pegawai pada perangkat daerah yang bersangkutan berdasarkan hasil evaluasi secara rutin dan berkelanjutan.", butuh_bukti: true, panduan: "Dokumentasi visual nilai budaya, Keputusan Kepala Perangkat Daerah, Dokumen kertas kerja, Dokumen rencana program & evaluasi tertulis, Dokumentasi foto/video pelaksanaan program budaya kerja nyata" },
    },
  },
];
