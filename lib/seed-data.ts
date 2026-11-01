export interface MataPelajaran {
  id_mapel: number;
  nama_mapel: string;
  kategori: 'Wajib' | 'Peminatan MIPA' | 'Peminatan IPS' | 'Peminatan Bahasa';
  deskripsi?: string;
}

export interface Jurusan {
  id_jurusan: number;
  nama_jurusan: string;
  rumpun: 'Saintek' | 'Soshum' | 'Campuran';
  fakultas: string;
  deskripsi: string;
  daya_tampung: number;
  passing_grade_indikatif: number;
  universitas_favorit: string[];
}

export interface AturanBobot {
  id_rule: number;
  id_jurusan: number;
  id_mapel: number;
  bobot: number; // Nilai persentase (total 100 per jurusan)
}

export interface Karir {
  id_karir: number;
  profesi: string;
  deskripsi: string;
  industri: string;
  estimasi_gaji: string;
  kualifikasi_utama: string[];
  prospek_masa_depan: 'Sangat Tinggi' | 'Tinggi' | 'Stabil';
}

export interface RelasiJurusanKarir {
  id: number;
  id_jurusan: number;
  id_karir: number;
}

export interface User {
  id: number;
  nisn_nip: string;
  nama: string;
  role: 'SISWA' | 'GURU_BK';
  kelas?: string;
  email?: string;
  password?: string;
}

export interface NilaiSiswa {
  id_nilai: number;
  id_siswa: number;
  id_mapel: number;
  nilai: number;
}

export interface HasilRekomendasi {
  id: number;
  id_siswa: number;
  id_jurusan: number;
  total_skor: number;
  persentase_kecocokan: number;
  ranking: number;
  tanggal_analisis: string;
}

export const initialMataPelajaran: MataPelajaran[] = [
  { id_mapel: 1, nama_mapel: 'Matematika Umum', kategori: 'Wajib', deskripsi: 'Logika dasar, aljabar, kalkulus dasar' },
  { id_mapel: 2, nama_mapel: 'Bahasa Indonesia', kategori: 'Wajib', deskripsi: 'Pemahaman teks, sintaksis, literasi' },
  { id_mapel: 3, nama_mapel: 'Bahasa Inggris', kategori: 'Wajib', deskripsi: 'Komunikasi global, reading comprehension' },
  { id_mapel: 4, nama_mapel: 'Pendidikan Pancasila / PPKn', kategori: 'Wajib', deskripsi: 'Hukum, tata negara, etika kebangsaan' },
  { id_mapel: 5, nama_mapel: 'Sejarah Indonesia', kategori: 'Wajib', deskripsi: 'Kronologi peradaban dan geopolitik nusantara' },
  { id_mapel: 6, nama_mapel: 'Matematika Tingkat Lanjut', kategori: 'Peminatan MIPA', deskripsi: 'Vektor, matriks, kalkulus lanjut' },
  { id_mapel: 7, nama_mapel: 'Fisika', kategori: 'Peminatan MIPA', deskripsi: 'Mekanika, termodinamika, elektromagnetik' },
  { id_mapel: 8, nama_mapel: 'Kimia', kategori: 'Peminatan MIPA', deskripsi: 'Stoikiometri, larutan, ikatan kimia' },
  { id_mapel: 9, nama_mapel: 'Biologi', kategori: 'Peminatan MIPA', deskripsi: 'Genetika, ekologi, fisiologi tubuh' },
  { id_mapel: 10, nama_mapel: 'Informatika', kategori: 'Peminatan MIPA', deskripsi: 'Algoritma, pemrograman, komputasi' },
  { id_mapel: 11, nama_mapel: 'Ekonomi', kategori: 'Peminatan IPS', deskripsi: 'Akuntansi dasar, pasar modal, makro/mikro' },
  { id_mapel: 12, nama_mapel: 'Sosiologi', kategori: 'Peminatan IPS', deskripsi: 'Struktur sosial, dinamika masyarakat' },
  { id_mapel: 13, nama_mapel: 'Geografi', kategori: 'Peminatan IPS', deskripsi: 'SIG, demografi, mitigasi bencana' },
  { id_mapel: 14, nama_mapel: 'Bahasa & Sastra Inggris', kategori: 'Peminatan Bahasa', deskripsi: 'Linguistik, analisis sastra asing' },
];

export const initialJurusan: Jurusan[] = [
  {
    id_jurusan: 1,
    nama_jurusan: 'Teknik Informatika / Ilmu Komputer',
    rumpun: 'Saintek',
    fakultas: 'Fakultas Teknik & Ilmu Komputer',
    deskripsi: 'Mempelajari rekayasa perangkat lunak, algoritma mutakhir, kecerdasan buatan, arsitektur komputasi awan, dan keamanan siber.',
    daya_tampung: 120,
    passing_grade_indikatif: 87.5,
    universitas_favorit: ['Institut Teknologi Bandung (ITB)', 'Universitas Indonesia (UI)', 'Universitas Gadjah Mada (UGM)', 'Institut Teknologi Sepuluh Nopember (ITS)']
  },
  {
    id_jurusan: 2,
    nama_jurusan: 'Kedokteran Umum',
    rumpun: 'Saintek',
    fakultas: 'Fakultas Kedokteran',
    deskripsi: 'Pendidikan medis holistik mencakup anatomi, fisiologi, patologi, farmakologi klinik, serta etika kedokteran dan diagnosis medis.',
    daya_tampung: 100,
    passing_grade_indikatif: 89.0,
    universitas_favorit: ['Universitas Padjadjaran (Unpad)', 'Universitas Indonesia (UI)', 'Universitas Gadjah Mada (UGM)', 'Universitas Airlangga (Unair)']
  },
  {
    id_jurusan: 3,
    nama_jurusan: 'Teknik Elektro',
    rumpun: 'Saintek',
    fakultas: 'Fakultas Teknik Elektro',
    deskripsi: 'Fokus pada sistem tenaga listrik, elektronika, telekomunikasi sinyal, instrumentasi medis, dan robotika industri.',
    daya_tampung: 95,
    passing_grade_indikatif: 83.5,
    universitas_favorit: ['Institut Teknologi Bandung (ITB)', 'Institut Teknologi Nasional (ITENAS)', 'Universitas Indonesia (UI)', 'Universitas Diponegoro (Undip)']
  },
  {
    id_jurusan: 4,
    nama_jurusan: 'Farmasi',
    rumpun: 'Saintek',
    fakultas: 'Sekolah Farmasi / Fakultas Farmasi',
    deskripsi: 'Sains dan teknologi formulasi obat-obatan, kimia medisinal, farmakoterapi penyakit, dan uji klinis kefarmasian.',
    daya_tampung: 80,
    passing_grade_indikatif: 84.0,
    universitas_favorit: ['Universitas Padjadjaran (Unpad)', 'Institut Teknologi Bandung (ITB)', 'Universitas Gadjah Mada (UGM)']
  },
  {
    id_jurusan: 5,
    nama_jurusan: 'Teknik Industri',
    rumpun: 'Saintek',
    fakultas: 'Fakultas Rekayasa Industri',
    deskripsi: 'Optimasi sistem terintegrasi yang melibatkan manusia, material, informasi, peralatan, dan energi untuk efisiensi rantai pasok.',
    daya_tampung: 110,
    passing_grade_indikatif: 82.0,
    universitas_favorit: ['Institut Teknologi Bandung (ITB)', 'Universitas Indonesia (UI)', 'Institut Teknologi Sepuluh Nopember (ITS)']
  },
  {
    id_jurusan: 6,
    nama_jurusan: 'Ilmu Komunikasi',
    rumpun: 'Soshum',
    fakultas: 'Fakultas Ilmu Komunikasi',
    deskripsi: 'Mengkaji proses komunikasi massa, jurnalistik digital, hubungan masyarakat (PR), penyiaran media, dan periklanan strategis.',
    daya_tampung: 130,
    passing_grade_indikatif: 85.0,
    universitas_favorit: ['Universitas Padjadjaran (Unpad)', 'Universitas Indonesia (UI)', 'Universitas Gadjah Mada (UGM)']
  },
  {
    id_jurusan: 7,
    nama_jurusan: 'Akuntansi',
    rumpun: 'Soshum',
    fakultas: 'Fakultas Ekonomi dan Bisnis',
    deskripsi: 'Pencatatan, pengauditan laporan keuangan, perpajakan, sistem informasi akuntansi korporat, dan analisis forensik keuangan.',
    daya_tampung: 140,
    passing_grade_indikatif: 86.0,
    universitas_favorit: ['Universitas Padjadjaran (Unpad)', 'Universitas Indonesia (UI)', 'Universitas Gadjah Mada (UGM)', 'Universitas Brawijaya (UB)']
  },
  {
    id_jurusan: 8,
    nama_jurusan: 'Manajemen Bisnis',
    rumpun: 'Soshum',
    fakultas: 'Fakultas Ekonomi dan Bisnis',
    deskripsi: 'Strategi pengelolaan organisasi bisnis, pemasaran digital, keuangan manajerial, manajemen operasional, dan kewirausahaan.',
    daya_tampung: 150,
    passing_grade_indikatif: 84.5,
    universitas_favorit: ['Universitas Indonesia (UI)', 'Universitas Padjadjaran (Unpad)', 'Institut Teknologi Bandung (SBM ITB)']
  },
  {
    id_jurusan: 9,
    nama_jurusan: 'Ilmu Hukum',
    rumpun: 'Soshum',
    fakultas: 'Fakultas Hukum',
    deskripsi: 'Mempelajari norma hukum pidana, perdata, hukum tata negara, hukum bisnis internasional, dan kemahiran litigasi advokasi.',
    daya_tampung: 160,
    passing_grade_indikatif: 85.5,
    universitas_favorit: ['Universitas Padjadjaran (Unpad)', 'Universitas Indonesia (UI)', 'Universitas Gadjah Mada (UGM)']
  },
  {
    id_jurusan: 10,
    nama_jurusan: 'Hubungan Internasional',
    rumpun: 'Soshum',
    fakultas: 'Fakultas Ilmu Sosial dan Ilmu Politik',
    deskripsi: 'Dinamika diplomasi antarnegara, resolusi konflik global, perdagangan internasional, dan hukum perjanjian multilateral.',
    daya_tampung: 70,
    passing_grade_indikatif: 87.0,
    universitas_favorit: ['Universitas Indonesia (UI)', 'Universitas Gadjah Mada (UGM)', 'Universitas Padjadjaran (Unpad)']
  },
  {
    id_jurusan: 11,
    nama_jurusan: 'Psikologi',
    rumpun: 'Campuran',
    fakultas: 'Fakultas Psikologi',
    deskripsi: 'Mempelajari perilaku kognitif, perkembangan manusia, kesehatan mental, intervensi klinis, dan psikologi industri organisasi.',
    daya_tampung: 120,
    passing_grade_indikatif: 86.5,
    universitas_favorit: ['Universitas Padjadjaran (Unpad)', 'Universitas Indonesia (UI)', 'Universitas Pendidikan Indonesia (UPI)']
  },
  {
    id_jurusan: 12,
    nama_jurusan: 'Desain Komunikasi Visual (DKV)',
    rumpun: 'Campuran',
    fakultas: 'Fakultas Seni Rupa dan Desain',
    deskripsi: 'Desain grafis interaktif, ilustrasi, branding visual identitas, animasi digital, UI/UX design, dan multimedia kreatif.',
    daya_tampung: 85,
    passing_grade_indikatif: 83.0,
    universitas_favorit: ['Institut Teknologi Bandung (ITB)', 'Institut Teknologi Nasional (ITENAS)', 'Universitas Telkom']
  }
];

export const initialAturanBobot: AturanBobot[] = [
  // Jurusan 1: Teknik Informatika (Total 100)
  { id_rule: 1, id_jurusan: 1, id_mapel: 6, bobot: 30 }, // Mat Lanjut
  { id_rule: 2, id_jurusan: 1, id_mapel: 10, bobot: 30 }, // Informatika
  { id_rule: 3, id_jurusan: 1, id_mapel: 3, bobot: 15 }, // B Inggris
  { id_rule: 4, id_jurusan: 1, id_mapel: 7, bobot: 15 }, // Fisika
  { id_rule: 5, id_jurusan: 1, id_mapel: 1, bobot: 10 }, // Mat Umum

  // Jurusan 2: Kedokteran Umum (Total 100)
  { id_rule: 6, id_jurusan: 2, id_mapel: 9, bobot: 35 }, // Biologi
  { id_rule: 7, id_jurusan: 2, id_mapel: 8, bobot: 30 }, // Kimia
  { id_rule: 8, id_jurusan: 2, id_mapel: 3, bobot: 15 }, // B Inggris
  { id_rule: 9, id_jurusan: 2, id_mapel: 7, bobot: 10 }, // Fisika
  { id_rule: 10, id_jurusan: 2, id_mapel: 1, bobot: 10 }, // Mat Umum

  // Jurusan 3: Teknik Elektro (Total 100)
  { id_rule: 11, id_jurusan: 3, id_mapel: 7, bobot: 35 }, // Fisika
  { id_rule: 12, id_jurusan: 3, id_mapel: 6, bobot: 30 }, // Mat Lanjut
  { id_rule: 13, id_jurusan: 3, id_mapel: 10, bobot: 15 }, // Informatika
  { id_rule: 14, id_jurusan: 3, id_mapel: 3, bobot: 10 }, // B Inggris
  { id_rule: 15, id_jurusan: 3, id_mapel: 1, bobot: 10 }, // Mat Umum

  // Jurusan 4: Farmasi (Total 100)
  { id_rule: 16, id_jurusan: 4, id_mapel: 8, bobot: 40 }, // Kimia
  { id_rule: 17, id_jurusan: 4, id_mapel: 9, bobot: 30 }, // Biologi
  { id_rule: 18, id_jurusan: 4, id_mapel: 1, bobot: 15 }, // Mat Umum
  { id_rule: 19, id_jurusan: 4, id_mapel: 3, bobot: 15 }, // B Inggris

  // Jurusan 5: Teknik Industri (Total 100)
  { id_rule: 20, id_jurusan: 5, id_mapel: 6, bobot: 25 }, // Mat Lanjut
  { id_rule: 21, id_jurusan: 5, id_mapel: 1, bobot: 20 }, // Mat Umum
  { id_rule: 22, id_jurusan: 5, id_mapel: 7, bobot: 20 }, // Fisika
  { id_rule: 23, id_jurusan: 5, id_mapel: 11, bobot: 20 }, // Ekonomi
  { id_rule: 24, id_jurusan: 5, id_mapel: 3, bobot: 15 }, // B Inggris

  // Jurusan 6: Ilmu Komunikasi (Total 100)
  { id_rule: 25, id_jurusan: 6, id_mapel: 2, bobot: 35 }, // B Indonesia
  { id_rule: 26, id_jurusan: 6, id_mapel: 3, bobot: 25 }, // B Inggris
  { id_rule: 27, id_jurusan: 6, id_mapel: 12, bobot: 25 }, // Sosiologi
  { id_rule: 28, id_jurusan: 6, id_mapel: 5, bobot: 15 }, // Sejarah

  // Jurusan 7: Akuntansi (Total 100)
  { id_rule: 29, id_jurusan: 7, id_mapel: 11, bobot: 40 }, // Ekonomi
  { id_rule: 30, id_jurusan: 7, id_mapel: 1, bobot: 30 }, // Mat Umum
  { id_rule: 31, id_jurusan: 7, id_mapel: 3, bobot: 15 }, // B Inggris
  { id_rule: 32, id_jurusan: 7, id_mapel: 2, bobot: 15 }, // B Indonesia

  // Jurusan 8: Manajemen Bisnis (Total 100)
  { id_rule: 33, id_jurusan: 8, id_mapel: 11, bobot: 35 }, // Ekonomi
  { id_rule: 34, id_jurusan: 8, id_mapel: 12, bobot: 25 }, // Sosiologi
  { id_rule: 35, id_jurusan: 8, id_mapel: 3, bobot: 25 }, // B Inggris
  { id_rule: 36, id_jurusan: 8, id_mapel: 1, bobot: 15 }, // Mat Umum

  // Jurusan 9: Ilmu Hukum (Total 100)
  { id_rule: 37, id_jurusan: 9, id_mapel: 4, bobot: 35 }, // PPKn
  { id_rule: 38, id_jurusan: 9, id_mapel: 2, bobot: 25 }, // B Indonesia
  { id_rule: 39, id_jurusan: 9, id_mapel: 12, bobot: 25 }, // Sosiologi
  { id_rule: 40, id_jurusan: 9, id_mapel: 5, bobot: 15 }, // Sejarah

  // Jurusan 10: Hubungan Internasional (Total 100)
  { id_rule: 41, id_jurusan: 10, id_mapel: 3, bobot: 35 }, // B Inggris
  { id_rule: 42, id_jurusan: 10, id_mapel: 14, bobot: 25 }, // Sastra Inggris
  { id_rule: 43, id_jurusan: 10, id_mapel: 12, bobot: 20 }, // Sosiologi
  { id_rule: 44, id_jurusan: 10, id_mapel: 13, bobot: 20 }, // Geografi

  // Jurusan 11: Psikologi (Total 100)
  { id_rule: 45, id_jurusan: 11, id_mapel: 9, bobot: 30 }, // Biologi
  { id_rule: 46, id_jurusan: 11, id_mapel: 12, bobot: 30 }, // Sosiologi
  { id_rule: 47, id_jurusan: 11, id_mapel: 1, bobot: 20 }, // Mat Umum
  { id_rule: 48, id_jurusan: 11, id_mapel: 3, bobot: 20 }, // B Inggris

  // Jurusan 12: DKV (Total 100)
  { id_rule: 49, id_jurusan: 12, id_mapel: 10, bobot: 30 }, // Informatika (desain digital)
  { id_rule: 50, id_jurusan: 12, id_mapel: 2, bobot: 25 }, // B Indonesia
  { id_rule: 51, id_jurusan: 12, id_mapel: 3, bobot: 25 }, // B Inggris
  { id_rule: 52, id_jurusan: 12, id_mapel: 12, bobot: 20 }, // Sosiologi (tren budaya)
];

export const initialKarir: Karir[] = [
  {
    id_karir: 1,
    profesi: 'Software Engineer / Fullstack Developer',
    deskripsi: 'Merancang, membangun, dan memelihara aplikasi skala besar, web platforms, dan sistem backend enterprise.',
    industri: 'Teknologi Informasi, Startup, FinTech',
    estimasi_gaji: 'Rp 8.000.000 - Rp 25.000.000 / bulan',
    kualifikasi_utama: ['Algoritma Pemrograman', 'Framework Web (React/Next/Node)', 'Database Design', 'Version Control Git'],
    prospek_masa_depan: 'Sangat Tinggi'
  },
  {
    id_karir: 2,
    profesi: 'Data Scientist & AI Specialist',
    deskripsi: 'Menganalisis big data, memodelkan Machine Learning/Deep Learning, dan mengekstrak insight bisnis strategis.',
    industri: 'Teknologi, Perbankan, E-Commerce',
    estimasi_gaji: 'Rp 10.000.000 - Rp 30.000.000 / bulan',
    kualifikasi_utama: ['Statistika & Kalkulus', 'Python/R', 'Machine Learning Models', 'Data Visualization'],
    prospek_masa_depan: 'Sangat Tinggi'
  },
  {
    id_karir: 3,
    profesi: 'Cybersecurity Analyst',
    deskripsi: 'Melindungi infrastruktur sistem digital dan data dari serangan siber, vulnerability assessment, dan penetration testing.',
    industri: 'Perbankan, Pertahanan, BUMN, SaaS',
    estimasi_gaji: 'Rp 9.000.000 - Rp 27.000.000 / bulan',
    kualifikasi_utama: ['Jaringan Komputer', 'Kriptografi', 'Ethical Hacking', 'Security Audit'],
    prospek_masa_depan: 'Sangat Tinggi'
  },
  {
    id_karir: 4,
    profesi: 'Dokter Umum & Praktisi Medis Klinis',
    deskripsi: 'Melakukan pemeriksaan primer, diagnosis penyakit, terapi farmakologi, dan pertolongan darurat pada pasien.',
    industri: 'Rumah Sakit, Puskesmas, Klinik Pratama',
    estimasi_gaji: 'Rp 8.000.000 - Rp 22.000.000 / bulan',
    kualifikasi_utama: ['Surat Tanda Registrasi (STR)', 'Diagnosis Klinis', 'Anatomi & Fisiologi', 'Komunikasi Terapeutik'],
    prospek_masa_depan: 'Tinggi'
  },
  {
    id_karir: 5,
    profesi: 'Dokter Spesialis (Bedah/Penyakit Dalam/Anak)',
    deskripsi: 'Menangani kondisi medis kompleks dalam spesialisasi tertentu dengan teknologi kedokteran intervensi.',
    industri: 'Rumah Sakit Rujukan, Pusat Penelitian Medis',
    estimasi_gaji: 'Rp 25.000.000 - Rp 70.000.000 / bulan',
    kualifikasi_utama: ['Pendidikan Dokter Spesialis (PPDS)', 'Tindakan Operasi/Intervensi Khusus', 'Manajemen Kasus Kritis'],
    prospek_masa_depan: 'Sangat Tinggi'
  },
  {
    id_karir: 6,
    profesi: 'Electrical & Power Systems Engineer',
    deskripsi: 'Merancang instalasi pembangkit tenaga listrik, distribusi tegangan tinggi, sistem otomatisasi gardu induk.',
    industri: 'PLN, EPC BUMN, Energi Terbarukan, Migas',
    estimasi_gaji: 'Rp 7.500.000 - Rp 20.000.000 / bulan',
    kualifikasi_utama: ['Sistem Tenaga Listrik', 'Analisis Rangkaian', 'Simulasi MATLAB/Simulink', 'Standar K3 Listrik'],
    prospek_masa_depan: 'Tinggi'
  },
  {
    id_karir: 7,
    profesi: 'Apoteker Industri & Formulasi Obat',
    deskripsi: 'Memimpin riset formulasi obat (R&D), kontrol kualitas (QC), dan kepatuhan Cara Pembuatan Obat yang Baik (CPOB).',
    industri: 'Farmasi Multinasional, Kosmetik, Biofarma',
    estimasi_gaji: 'Rp 7.000.000 - Rp 18.000.000 / bulan',
    kualifikasi_utama: ['Surat Izin Praktik Apoteker (SIPA)', 'Kimia Analitik', 'Validasi Metode Farmasi', 'Regulasi BPOM'],
    prospek_masa_depan: 'Tinggi'
  },
  {
    id_karir: 8,
    profesi: 'Supply Chain & Operations Manager',
    deskripsi: 'Mengelola efisiensi rantai pasok global, logistik pergudangan, pengendalian mutu Six Sigma di lini produksi pabrik.',
    industri: 'FMCG, Manufaktur Otomotif, Logistik',
    estimasi_gaji: 'Rp 8.500.000 - Rp 26.000.000 / bulan',
    kualifikasi_utama: ['Lean Manufacturing', 'Six Sigma', 'ERP SAP/Oracle', 'Optimasi Operasional'],
    prospek_masa_depan: 'Tinggi'
  },
  {
    id_karir: 9,
    profesi: 'Public Relations (PR) Specialist & Brand Strategist',
    deskripsi: 'Mengelola reputasi publik korporasi, menjalin relasi pers media massa, serta merancang komunikasi krisis.',
    industri: 'Agensi PR, Korporasi Multinasional, Pemerintahan',
    estimasi_gaji: 'Rp 6.500.000 - Rp 18.000.000 / bulan',
    kualifikasi_utama: ['Keterampilan Negosiasi', 'Media Relations', 'Press Release Writing', 'Crisis Communication'],
    prospek_masa_depan: 'Tinggi'
  },
  {
    id_karir: 10,
    profesi: 'Akuntan Publik & Auditor Keuangan',
    deskripsi: 'Memeriksa keandalan laporan keuangan perusahaan sesuai PSAK/IFRS dan memberikan opini audit independen.',
    industri: 'Kantor Akuntan Publik (KAP Big 4), Finansial',
    estimasi_gaji: 'Rp 7.500.000 - Rp 25.000.000 / bulan',
    kualifikasi_utama: ['Sertifikasi CPA / CA', 'Standar Akuntansi Keuangan', 'Audit Forensik', 'Taxation Regulation'],
    prospek_masa_depan: 'Tinggi'
  },
  {
    id_karir: 11,
    profesi: 'Business Development & Investment Analyst',
    deskripsi: 'Mengevaluasi peluang ekspansi pasar baru, proyeksi valuasi bisnis, dan menjalin kemitraan investasi ventura.',
    industri: 'Venture Capital, Investment Banking, Korporat',
    estimasi_gaji: 'Rp 8.000.000 - Rp 24.000.000 / bulan',
    kualifikasi_utama: ['Financial Modeling', 'Market Feasibility Study', 'Pitching & Deal Closing'],
    prospek_masa_depan: 'Tinggi'
  },
  {
    id_karir: 12,
    profesi: 'Advokat / Corporate Legal Counsel',
    deskripsi: 'Menyusun kontrak komersial, memastikan kepatuhan hukum perusahaan, dan mewakili klien di persidangan arbitrase.',
    industri: 'Law Firm, Perusahaan Publik, Lembaga Negara',
    estimasi_gaji: 'Rp 8.500.000 - Rp 35.000.000 / bulan',
    kualifikasi_utama: ['Lulus Ujian Profesi Advokat (UPA)', 'Penyusunan Kontrak (Legal Drafting)', 'Hukum Korporasi'],
    prospek_masa_depan: 'Tinggi'
  },
  {
    id_karir: 13,
    profesi: 'Diplomat & Staf Hubungan Internasional',
    deskripsi: 'Mewakili kepentingan kedaulatan negara dalam forum bilateral/multilateral (PBB, ASEAN) dan negosiasi traktat.',
    industri: 'Kementerian Luar Negeri, Organisasi Internasional',
    estimasi_gaji: 'Rp 8.000.000 - Rp 28.000.000 / bulan',
    kualifikasi_utama: ['Diplomatic Protocol', 'Kefasihan Bahasa Asing', 'Analisis Geopolitik Global'],
    prospek_masa_depan: 'Stabil'
  },
  {
    id_karir: 14,
    profesi: 'Psikolog Klinis & Konselor Kesehatan Mental',
    deskripsi: 'Melakukan asesmen psikologis, tes kepribadian kognitif, dan sesi psikoterapi untuk menangani gangguan mental emosional.',
    industri: 'Klinik Psikologi, Rumah Sakit Jiwa, Praktik Mandiri',
    estimasi_gaji: 'Rp 6.500.000 - Rp 18.000.000 / bulan',
    kualifikasi_utama: ['Surat Izin Praktik Psikolog (SIPP)', 'Tes Alat Ukur Psikologis (WAIS/MMPI)', 'Konseling Empati'],
    prospek_masa_depan: 'Sangat Tinggi'
  },
  {
    id_karir: 15,
    profesi: 'UI/UX Designer & Product Designer',
    deskripsi: 'Merancang arsitektur informasi, user flow, wireframe, prototipe interaktif, dan visual estetis produk digital.',
    industri: 'Tech Companies, Creative Agency, Startups',
    estimasi_gaji: 'Rp 7.500.000 - Rp 22.000.000 / bulan',
    kualifikasi_utama: ['Figma / Prototyping', 'Design System', 'User Research & Testing', 'Visual Hierarchy'],
    prospek_masa_depan: 'Sangat Tinggi'
  }
];

export const initialRelasiJurusanKarir: RelasiJurusanKarir[] = [
  // Jurusan 1: Teknik Informatika
  { id: 1, id_jurusan: 1, id_karir: 1 }, // Software Engineer
  { id: 2, id_jurusan: 1, id_karir: 2 }, // Data Scientist
  { id: 3, id_jurusan: 1, id_karir: 3 }, // Cybersecurity

  // Jurusan 2: Kedokteran Umum
  { id: 4, id_jurusan: 2, id_karir: 4 }, // Dokter Umum
  { id: 5, id_jurusan: 2, id_karir: 5 }, // Dokter Spesialis

  // Jurusan 3: Teknik Elektro
  { id: 6, id_jurusan: 3, id_karir: 6 }, // Electrical Engineer
  { id: 7, id_jurusan: 3, id_karir: 1 }, // Software Engineer (embedded)

  // Jurusan 4: Farmasi
  { id: 8, id_jurusan: 4, id_karir: 7 }, // Apoteker Industri

  // Jurusan 5: Teknik Industri
  { id: 9, id_jurusan: 5, id_karir: 8 }, // Supply Chain Manager
  { id: 10, id_jurusan: 5, id_karir: 11 }, // Business Analyst

  // Jurusan 6: Ilmu Komunikasi
  { id: 11, id_jurusan: 6, id_karir: 9 }, // PR Specialist

  // Jurusan 7: Akuntansi
  { id: 12, id_jurusan: 7, id_karir: 10 }, // Akuntan Publik

  // Jurusan 8: Manajemen Bisnis
  { id: 13, id_jurusan: 8, id_karir: 11 }, // Business Development
  { id: 14, id_jurusan: 8, id_karir: 8 }, // Operations Manager

  // Jurusan 9: Ilmu Hukum
  { id: 15, id_jurusan: 9, id_karir: 12 }, // Advokat

  // Jurusan 10: Hubungan Internasional
  { id: 16, id_jurusan: 10, id_karir: 13 }, // Diplomat
  { id: 17, id_jurusan: 10, id_karir: 9 }, // PR / International Relations

  // Jurusan 11: Psikologi
  { id: 18, id_jurusan: 11, id_karir: 14 }, // Psikolog Klinis

  // Jurusan 12: DKV
  { id: 19, id_jurusan: 12, id_karir: 15 }, // UI/UX Designer
];

export const initialUsers: User[] = [
  // Siswa SMAN 1 Bandung
  {
    id: 1,
    nisn_nip: '152023004',
    nama: 'Sakhiy Amru Abdillah',
    role: 'SISWA',
    kelas: 'XII-MIPA 1',
    email: 'sakhiy@sman1bdg.sch.id',
    password: 'password123'
  },
  {
    id: 2,
    nisn_nip: '152023012',
    nama: 'Ni Made Dwi Salsa Anggraeni',
    role: 'SISWA',
    kelas: 'XII-MIPA 2',
    email: 'salsa@sman1bdg.sch.id',
    password: 'password123'
  },
  {
    id: 3,
    nisn_nip: '152023039',
    nama: 'Kahla Arsyaba',
    role: 'SISWA',
    kelas: 'XII-IPS 1',
    email: 'kahla@sman1bdg.sch.id',
    password: 'password123'
  },
  {
    id: 4,
    nisn_nip: '0061234504',
    nama: 'Budi Santoso',
    role: 'SISWA',
    kelas: 'XII-MIPA 3',
    email: 'budi.santoso@sman1bdg.sch.id',
    password: 'password123'
  },
  {
    id: 5,
    nisn_nip: '0061234505',
    nama: 'Siti Nurhaliza',
    role: 'SISWA',
    kelas: 'XII-IPS 2',
    email: 'siti.nurhaliza@sman1bdg.sch.id',
    password: 'password123'
  },
  // Guru BK & Pengelola Sekolah SMAN 1 Bandung
  {
    id: 100,
    nisn_nip: '197805122002122001',
    nama: 'Dra. Hj. Ratna Juwita, M.Pd (Koordinator BK)',
    role: 'GURU_BK',
    kelas: 'Guru BK Tingkat XII',
    email: 'ratna.bk@sman1bdg.sch.id',
    password: 'adminbk123'
  },
  {
    id: 101,
    nisn_nip: 'admin',
    nama: 'Admin BK SMAN 1 Bandung',
    role: 'GURU_BK',
    kelas: 'Unit Layanan Bimbingan & Konseling',
    email: 'admin.bk@sman1bdg.sch.id',
    password: 'admin'
  }
];

export const initialNilaiSiswa: NilaiSiswa[] = [
  // Siswa 1 (Sakhiy - Kuat di Informatika, Mat Lanjut, Fisika)
  { id_nilai: 1, id_siswa: 1, id_mapel: 1, nilai: 88 },
  { id_nilai: 2, id_siswa: 1, id_mapel: 2, nilai: 86 },
  { id_nilai: 3, id_siswa: 1, id_mapel: 3, nilai: 92 },
  { id_nilai: 4, id_siswa: 1, id_mapel: 4, nilai: 85 },
  { id_nilai: 5, id_siswa: 1, id_mapel: 5, nilai: 84 },
  { id_nilai: 6, id_siswa: 1, id_mapel: 6, nilai: 94 },
  { id_nilai: 7, id_siswa: 1, id_mapel: 7, nilai: 90 },
  { id_nilai: 8, id_siswa: 1, id_mapel: 8, nilai: 82 },
  { id_nilai: 9, id_siswa: 1, id_mapel: 9, nilai: 80 },
  { id_nilai: 10, id_siswa: 1, id_mapel: 10, nilai: 96 },
  { id_nilai: 11, id_siswa: 1, id_mapel: 11, nilai: 78 },
  { id_nilai: 12, id_siswa: 1, id_mapel: 12, nilai: 80 },
  { id_nilai: 13, id_siswa: 1, id_mapel: 13, nilai: 76 },
  { id_nilai: 14, id_siswa: 1, id_mapel: 14, nilai: 88 },

  // Siswa 2 (Salsa - Kuat di Kedokteran: Biologi & Kimia)
  { id_nilai: 15, id_siswa: 2, id_mapel: 1, nilai: 85 },
  { id_nilai: 16, id_siswa: 2, id_mapel: 2, nilai: 88 },
  { id_nilai: 17, id_siswa: 2, id_mapel: 3, nilai: 90 },
  { id_nilai: 18, id_siswa: 2, id_mapel: 4, nilai: 86 },
  { id_nilai: 19, id_siswa: 2, id_mapel: 5, nilai: 82 },
  { id_nilai: 20, id_siswa: 2, id_mapel: 6, nilai: 84 },
  { id_nilai: 21, id_siswa: 2, id_mapel: 7, nilai: 83 },
  { id_nilai: 22, id_siswa: 2, id_mapel: 8, nilai: 95 },
  { id_nilai: 23, id_siswa: 2, id_mapel: 9, nilai: 97 },
  { id_nilai: 24, id_siswa: 2, id_mapel: 10, nilai: 81 },
  { id_nilai: 25, id_siswa: 2, id_mapel: 11, nilai: 79 },
  { id_nilai: 26, id_siswa: 2, id_mapel: 12, nilai: 83 },
  { id_nilai: 27, id_siswa: 2, id_mapel: 13, nilai: 78 },
  { id_nilai: 28, id_siswa: 2, id_mapel: 14, nilai: 87 },

  // Siswa 3 (Kahla - Kuat di Soshum: Ekonomi, Sosiologi, B Indonesia)
  { id_nilai: 29, id_siswa: 3, id_mapel: 1, nilai: 86 },
  { id_nilai: 30, id_siswa: 3, id_mapel: 2, nilai: 94 },
  { id_nilai: 31, id_siswa: 3, id_mapel: 3, nilai: 91 },
  { id_nilai: 32, id_siswa: 3, id_mapel: 4, nilai: 92 },
  { id_nilai: 33, id_siswa: 3, id_mapel: 5, nilai: 88 },
  { id_nilai: 34, id_siswa: 3, id_mapel: 6, nilai: 70 },
  { id_nilai: 35, id_siswa: 3, id_mapel: 7, nilai: 72 },
  { id_nilai: 36, id_siswa: 3, id_mapel: 8, nilai: 71 },
  { id_nilai: 37, id_siswa: 3, id_mapel: 9, nilai: 75 },
  { id_nilai: 38, id_siswa: 3, id_mapel: 10, nilai: 78 },
  { id_nilai: 39, id_siswa: 3, id_mapel: 11, nilai: 96 },
  { id_nilai: 40, id_siswa: 3, id_mapel: 12, nilai: 95 },
  { id_nilai: 41, id_siswa: 3, id_mapel: 13, nilai: 89 },
  { id_nilai: 42, id_siswa: 3, id_mapel: 14, nilai: 88 }
];

