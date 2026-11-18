-- =========================================================================
-- SISTEM PEMETAAN JURUSAN & PROSPEK KARIR BERBASIS NILAI AKADEMIK
-- SMAN 1 BANDUNG - IFB-401 MANAJEMEN PROYEK GRUP A5
-- Uniform Relational Schema (MySQL)
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `sman1_mapping_jurusan` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sman1_mapping_jurusan`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `hasil_rekomendasi`;
DROP TABLE IF EXISTS `nilai_siswa`;
DROP TABLE IF EXISTS `jurusan_karir`;
DROP TABLE IF EXISTS `relasi_jurusan_karir`;
DROP TABLE IF EXISTS `aturan_bobot`;
DROP TABLE IF EXISTS `karir`;
DROP TABLE IF EXISTS `jurusan`;
DROP TABLE IF EXISTS `mata_pelajaran`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Tabel users
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nisn_nip` VARCHAR(50) NOT NULL,
  `nama` VARCHAR(150) NOT NULL,
  `role` ENUM('SISWA', 'GURU_BK') NOT NULL DEFAULT 'SISWA',
  `kelas` VARCHAR(50) NULL,
  `email` VARCHAR(100) NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `uq_users_nisn_nip` UNIQUE (`nisn_nip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel mata_pelajaran
CREATE TABLE `mata_pelajaran` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_mapel` VARCHAR(100) NOT NULL,
  `kategori` ENUM('Wajib', 'Peminatan MIPA', 'Peminatan IPS', 'Peminatan Bahasa') NOT NULL,
  `deskripsi` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel jurusan
CREATE TABLE `jurusan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_jurusan` VARCHAR(150) NOT NULL,
  `rumpun` ENUM('Saintek', 'Soshum', 'Campuran') NOT NULL,
  `fakultas` VARCHAR(150) NOT NULL,
  `deskripsi` TEXT NOT NULL,
  `daya_tampung` INT NOT NULL DEFAULT 50,
  `passing_grade_indikatif` DECIMAL(5,2) NOT NULL DEFAULT 80.00,
  `universitas_favorit` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel aturan_bobot (Matriks Rule-Based Matching)
CREATE TABLE `aturan_bobot` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_jurusan` INT NOT NULL,
  `id_mata_pelajaran` INT NOT NULL,
  `bobot` DECIMAL(5,2) NOT NULL COMMENT 'Bobot kepentingan mapel (persen)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `uq_aturan_bobot_jurusan_mapel` UNIQUE (`id_jurusan`, `id_mata_pelajaran`),
  CONSTRAINT `fk_aturan_bobot_jurusan` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_aturan_bobot_mata_pelajaran` FOREIGN KEY (`id_mata_pelajaran`) REFERENCES `mata_pelajaran`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel karir
CREATE TABLE `karir` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `profesi` VARCHAR(150) NOT NULL,
  `deskripsi` TEXT NOT NULL,
  `industri` VARCHAR(150) NOT NULL,
  `estimasi_gaji` VARCHAR(100) NOT NULL,
  `kualifikasi_utama` TEXT NOT NULL,
  `prospek_masa_depan` ENUM('Sangat Tinggi', 'Tinggi', 'Stabil') NOT NULL DEFAULT 'Tinggi',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabel jurusan_karir (Career Linker Module)
CREATE TABLE `jurusan_karir` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_jurusan` INT NOT NULL,
  `id_karir` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `uq_jurusan_karir` UNIQUE (`id_jurusan`, `id_karir`),
  CONSTRAINT `fk_jurusan_karir_jurusan` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jurusan_karir_karir` FOREIGN KEY (`id_karir`) REFERENCES `karir`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tabel nilai_siswa
CREATE TABLE `nilai_siswa` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT NOT NULL,
  `id_mata_pelajaran` INT NOT NULL,
  `nilai` DECIMAL(5,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `uq_nilai_siswa_user_mapel` UNIQUE (`id_user`, `id_mata_pelajaran`),
  CONSTRAINT `fk_nilai_siswa_user` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_nilai_siswa_mata_pelajaran` FOREIGN KEY (`id_mata_pelajaran`) REFERENCES `mata_pelajaran`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Tabel hasil_rekomendasi
CREATE TABLE `hasil_rekomendasi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT NOT NULL,
  `id_jurusan` INT NOT NULL,
  `total_skor` DECIMAL(7,2) NOT NULL,
  `persentase_kecocokan` DECIMAL(5,2) NOT NULL,
  `ranking` INT NOT NULL,
  `tanggal_analisis` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_hasil_rekomendasi_user` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hasil_rekomendasi_jurusan` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================================
-- SEED DATA AWAL SMAN 1 BANDUNG
-- =========================================================================

-- Insert Users
INSERT INTO `users` (`id`, `nisn_nip`, `nama`, `role`, `kelas`, `email`, `password`) VALUES
(1, '152023004', 'Sakhiy Amru Abdillah', 'SISWA', 'XII-MIPA 1', 'sakhiy@sman1bdg.sch.id', 'password123'),
(2, '152023012', 'Ni Made Dwi Salsa Anggraeni', 'SISWA', 'XII-MIPA 2', 'salsa@sman1bdg.sch.id', 'password123'),
(3, '152023039', 'Kahla Arsyaba', 'SISWA', 'XII-IPS 1', 'kahla@sman1bdg.sch.id', 'password123'),
(4, '0061234504', 'Budi Santoso', 'SISWA', 'XII-MIPA 3', 'budi.santoso@sman1bdg.sch.id', 'password123'),
(5, '0061234505', 'Siti Nurhaliza', 'SISWA', 'XII-IPS 2', 'siti.nurhaliza@sman1bdg.sch.id', 'password123'),
(100, '197805122002122001', 'Dra. Hj. Ratna Juwita, M.Pd (Koordinator BK)', 'GURU_BK', 'Guru BK Tingkat XII', 'ratna.bk@sman1bdg.sch.id', 'adminbk123'),
(101, 'admin', 'Admin BK SMAN 1 Bandung', 'GURU_BK', 'Unit Layanan Bimbingan & Konseling', 'admin.bk@sman1bdg.sch.id', 'admin');

-- Insert Mata Pelajaran
INSERT INTO `mata_pelajaran` (`id`, `nama_mapel`, `kategori`, `deskripsi`) VALUES
(1, 'Matematika Umum', 'Wajib', 'Logika dasar, aljabar, kalkulus dasar'),
(2, 'Bahasa Indonesia', 'Wajib', 'Pemahaman teks, sintaksis, literasi'),
(3, 'Bahasa Inggris', 'Wajib', 'Komunikasi global, reading comprehension'),
(4, 'Pendidikan Pancasila / PPKn', 'Wajib', 'Hukum, tata negara, etika kebangsaan'),
(5, 'Sejarah Indonesia', 'Wajib', 'Kronologi peradaban dan geopolitik nusantara'),
(6, 'Matematika Tingkat Lanjut', 'Peminatan MIPA', 'Vektor, matriks, kalkulus lanjut'),
(7, 'Fisika', 'Peminatan MIPA', 'Mekanika, termodinamika, elektromagnetik'),
(8, 'Kimia', 'Peminatan MIPA', 'Stoikiometri, larutan, ikatan kimia'),
(9, 'Biologi', 'Peminatan MIPA', 'Genetika, ekologi, fisiologi tubuh'),
(10, 'Informatika', 'Peminatan MIPA', 'Algoritma, pemrograman, komputasi'),
(11, 'Ekonomi', 'Peminatan IPS', 'Akuntansi dasar, pasar modal, makro/mikro'),
(12, 'Sosiologi', 'Peminatan IPS', 'Struktur sosial, dinamika masyarakat'),
(13, 'Geografi', 'Peminatan IPS', 'SIG, demografi, mitigasi bencana'),
(14, 'Bahasa & Sastra Inggris', 'Peminatan Bahasa', 'Linguistik, analisis sastra asing');

-- Insert Jurusan
INSERT INTO `jurusan` (`id`, `nama_jurusan`, `rumpun`, `fakultas`, `deskripsi`, `daya_tampung`, `passing_grade_indikatif`, `universitas_favorit`) VALUES
(1, 'Teknik Informatika / Ilmu Komputer', 'Saintek', 'Fakultas Teknik & Ilmu Komputer', 'Mempelajari rekayasa perangkat lunak, algoritma mutakhir, kecerdasan buatan, arsitektur komputasi awan, dan keamanan siber.', 120, 87.50, '["Institut Teknologi Bandung (ITB)","Universitas Indonesia (UI)","Universitas Gadjah Mada (UGM)","Institut Teknologi Sepuluh Nopember (ITS)"]'),
(2, 'Kedokteran Umum', 'Saintek', 'Fakultas Kedokteran', 'Pendidikan medis holistik mencakup anatomi, fisiologi, patologi, farmakologi klinik, serta etika kedokteran dan diagnosis medis.', 100, 89.00, '["Universitas Padjadjaran (Unpad)","Universitas Indonesia (UI)","Universitas Gadjah Mada (UGM)","Universitas Airlangga (Unair)"]'),
(3, 'Teknik Elektro', 'Saintek', 'Fakultas Teknik Elektro', 'Fokus pada sistem tenaga listrik, elektronika, telekomunikasi sinyal, instrumentasi medis, dan robotika industri.', 95, 83.50, '["Institut Teknologi Bandung (ITB)","Institut Teknologi Nasional (ITENAS)","Universitas Indonesia (UI)","Universitas Diponegoro (Undip)"]'),
(4, 'Farmasi', 'Saintek', 'Sekolah Farmasi / Fakultas Farmasi', 'Sains dan teknologi formulasi obat-obatan, kimia medisinal, farmakoterapi penyakit, dan uji klinis kefarmasian.', 80, 84.00, '["Universitas Padjadjaran (Unpad)","Institut Teknologi Bandung (ITB)","Universitas Gadjah Mada (UGM)"]'),
(5, 'Teknik Industri', 'Saintek', 'Fakultas Rekayasa Industri', 'Optimasi sistem terintegrasi yang melibatkan manusia, material, informasi, peralatan, dan energi untuk efisiensi rantai pasok.', 110, 82.00, '["Institut Teknologi Bandung (ITB)","Universitas Indonesia (UI)","Institut Teknologi Sepuluh Nopember (ITS)"]'),
(6, 'Ilmu Komunikasi', 'Soshum', 'Fakultas Ilmu Komunikasi', 'Mengkaji proses komunikasi massa, jurnalistik digital, hubungan masyarakat (PR), penyiaran media, dan periklanan strategis.', 130, 85.00, '["Universitas Padjadjaran (Unpad)","Universitas Indonesia (UI)","Universitas Gadjah Mada (UGM)"]'),
(7, 'Akuntansi', 'Soshum', 'Fakultas Ekonomi dan Bisnis', 'Pencatatan, pengauditan laporan keuangan, perpajakan, sistem informasi akuntansi korporat, dan analisis forensik keuangan.', 140, 86.00, '["Universitas Padjadjaran (Unpad)","Universitas Indonesia (UI)","Universitas Gadjah Mada (UGM)","Universitas Brawijaya (UB)"]'),
(8, 'Manajemen Bisnis', 'Soshum', 'Fakultas Ekonomi dan Bisnis', 'Strategi pengelolaan organisasi bisnis, pemasaran digital, keuangan manajerial, manajemen operasional, dan kewirausahaan.', 150, 84.50, '["Universitas Indonesia (UI)","Universitas Padjadjaran (Unpad)","Institut Teknologi Bandung (SBM ITB)"]'),
(9, 'Ilmu Hukum', 'Soshum', 'Fakultas Hukum', 'Mempelajari norma hukum pidana, perdata, hukum tata negara, hukum bisnis internasional, dan kemahiran litigasi advokasi.', 160, 85.50, '["Universitas Padjadjaran (Unpad)","Universitas Indonesia (UI)","Universitas Gadjah Mada (UGM)"]'),
(10, 'Hubungan Internasional', 'Soshum', 'Fakultas Ilmu Sosial dan Ilmu Politik', 'Dinamika diplomasi antarnegara, resolusi konflik global, perdagangan internasional, dan hukum perjanjian multilateral.', 70, 87.00, '["Universitas Indonesia (UI)","Universitas Gadjah Mada (UGM)","Universitas Padjadjaran (Unpad)"]'),
(11, 'Psikologi', 'Campuran', 'Fakultas Psikologi', 'Mempelajari perilaku kognitif, perkembangan manusia, kesehatan mental, intervensi klinis, dan psikologi industri organisasi.', 120, 86.50, '["Universitas Padjadjaran (Unpad)","Universitas Indonesia (UI)","Universitas Pendidikan Indonesia (UPI)"]'),
(12, 'Desain Komunikasi Visual (DKV)', 'Campuran', 'Fakultas Seni Rupa dan Desain', 'Desain grafis interaktif, ilustrasi, branding visual identitas, animasi digital, UI/UX design, dan multimedia kreatif.', 85, 83.00, '["Institut Teknologi Bandung (ITB)","Institut Teknologi Nasional (ITENAS)","Universitas Telkom"]');

-- Insert Aturan Bobot Mapel
INSERT INTO `aturan_bobot` (`id`, `id_jurusan`, `id_mata_pelajaran`, `bobot`) VALUES
(1, 1, 6, 30.00), (2, 1, 10, 30.00), (3, 1, 3, 15.00), (4, 1, 7, 15.00), (5, 1, 1, 10.00),
(6, 2, 9, 35.00), (7, 2, 8, 30.00), (8, 2, 3, 15.00), (9, 2, 7, 10.00), (10, 2, 1, 10.00),
(11, 3, 7, 35.00), (12, 3, 6, 30.00), (13, 3, 10, 15.00), (14, 3, 3, 10.00), (15, 3, 1, 10.00),
(16, 4, 8, 40.00), (17, 4, 9, 30.00), (18, 4, 1, 15.00), (19, 4, 3, 15.00),
(20, 5, 6, 25.00), (21, 5, 1, 20.00), (22, 5, 7, 20.00), (23, 5, 11, 20.00), (24, 5, 3, 15.00),
(25, 6, 2, 35.00), (26, 6, 3, 25.00), (27, 6, 12, 25.00), (28, 6, 5, 15.00),
(29, 7, 11, 40.00), (30, 7, 1, 30.00), (31, 7, 3, 15.00), (32, 7, 2, 15.00),
(33, 8, 11, 35.00), (34, 8, 12, 25.00), (35, 8, 3, 25.00), (36, 8, 1, 15.00),
(37, 9, 4, 35.00), (38, 9, 2, 25.00), (39, 9, 12, 25.00), (40, 9, 5, 15.00),
(41, 10, 3, 35.00), (42, 10, 14, 25.00), (43, 10, 12, 20.00), (44, 10, 13, 20.00),
(45, 11, 9, 30.00), (46, 11, 12, 30.00), (47, 11, 1, 20.00), (48, 11, 3, 20.00),
(49, 12, 10, 30.00), (50, 12, 2, 25.00), (51, 12, 3, 25.00), (52, 12, 12, 20.00);

-- Insert Karir
INSERT INTO `karir` (`id`, `profesi`, `deskripsi`, `industri`, `estimasi_gaji`, `kualifikasi_utama`, `prospek_masa_depan`) VALUES
(1, 'Software Engineer / Fullstack Developer', 'Merancang, membangun, dan memelihara aplikasi skala besar, web platforms, dan sistem backend enterprise.', 'Teknologi Informasi, Startup, FinTech', 'Rp 8.000.000 - Rp 25.000.000 / bulan', '["Algoritma Pemrograman","Framework Web (React/Next/Node)","Database Design","Version Control Git"]', 'Sangat Tinggi'),
(2, 'Data Scientist & AI Specialist', 'Menganalisis big data, memodelkan Machine Learning/Deep Learning, dan mengekstrak insight bisnis strategis.', 'Teknologi, Perbankan, E-Commerce', 'Rp 10.000.000 - Rp 30.000.000 / bulan', '["Statistika & Kalkulus","Python/R","Machine Learning Models","Data Visualization"]', 'Sangat Tinggi'),
(3, 'Cybersecurity Analyst', 'Melindungi infrastruktur sistem digital dan data dari serangan siber, vulnerability assessment, dan penetration testing.', 'Perbankan, Pertahanan, BUMN, SaaS', 'Rp 9.000.000 - Rp 27.000.000 / bulan', '["Jaringan Komputer","Kriptografi","Ethical Hacking","Security Audit"]', 'Sangat Tinggi'),
(4, 'Dokter Umum & Praktisi Medis Klinis', 'Melakukan pemeriksaan primer, diagnosis penyakit, terapi farmakologi, dan pertolongan darurat pada pasien.', 'Rumah Sakit, Puskesmas, Klinik Pratama', 'Rp 8.000.000 - Rp 22.000.000 / bulan', '["Surat Tanda Registrasi (STR)","Diagnosis Klinis","Anatomi & Fisiologi","Komunikasi Terapeutik"]', 'Tinggi'),
(5, 'Dokter Spesialis (Bedah/Penyakit Dalam/Anak)', 'Menangani kondisi medis kompleks dalam spesialisasi tertentu dengan teknologi kedokteran intervensi.', 'Rumah Sakit Rujukan, Pusat Penelitian Medis', 'Rp 25.000.000 - Rp 70.000.000 / bulan', '["Pendidikan Dokter Spesialis (PPDS)","Tindakan Operasi/Intervensi Khusus","Manajemen Kasus Kritis"]', 'Sangat Tinggi'),
(6, 'Electrical & Power Systems Engineer', 'Merancang instalasi pembangkit tenaga listrik, distribusi tegangan tinggi, sistem otomatisasi gardu induk.', 'PLN, EPC BUMN, Energi Terbarukan, Migas', 'Rp 7.500.000 - Rp 20.000.000 / bulan', '["Sistem Tenaga Listrik","Analisis Rangkaian","Simulasi MATLAB/Simulink","Standar K3 Listrik"]', 'Tinggi'),
(7, 'Apoteker Industri & Formulasi Obat', 'Memimpin riset formulasi obat (R&D), kontrol kualitas (QC), dan kepatuhan Cara Pembuatan Obat yang Baik (CPOB).', 'Farmasi Multinasional, Kosmetik, Biofarma', 'Rp 7.000.000 - Rp 18.000.000 / bulan', '["Surat Izin Praktik Apoteker (SIPA)","Kimia Analitik","Validasi Metode Farmasi","Regulasi BPOM"]', 'Tinggi'),
(8, 'Supply Chain & Operations Manager', 'Mengelola efisiensi rantai pasok global, logistik pergudangan, pengendalian mutu Six Sigma di lini produksi pabrik.', 'FMCG, Manufaktur Otomotif, Logistik', 'Rp 8.500.000 - Rp 26.000.000 / bulan', '["Lean Manufacturing","Six Sigma","ERP SAP/Oracle","Optimasi Operasional"]', 'Tinggi'),
(9, 'Public Relations (PR) Specialist & Brand Strategist', 'Mengelola reputasi publik korporasi, menjalin relasi pers media massa, serta merancang komunikasi krisis.', 'Agensi PR, Korporasi Multinasional, Pemerintahan', 'Rp 6.500.000 - Rp 18.000.000 / bulan', '["Keterampilan Negosiasi","Media Relations","Press Release Writing","Crisis Communication"]', 'Tinggi'),
(10, 'Akuntan Publik & Auditor Keuangan', 'Memeriksa keandalan laporan keuangan perusahaan sesuai PSAK/IFRS dan memberikan opini audit independen.', 'Kantor Akuntan Publik (KAP Big 4), Finansial', 'Rp 7.500.000 - Rp 25.000.000 / bulan', '["Sertifikasi CPA / CA","Standar Akuntansi Keuangan","Audit Forensik","Taxation Regulation"]', 'Tinggi'),
(11, 'Business Development & Investment Analyst', 'Mengevaluasi peluang ekspansi pasar baru, proyeksi valuasi bisnis, dan menjalin kemitraan investasi ventura.', 'Venture Capital, Investment Banking, Korporat', 'Rp 8.000.000 - Rp 24.000.000 / bulan', '["Financial Modeling","Market Feasibility Study","Pitching & Deal Closing"]', 'Tinggi'),
(12, 'Advokat / Corporate Legal Counsel', 'Menyusun kontrak komersial, memastikan kepatuhan hukum perusahaan, dan mewakili klien di persidangan arbitrase.', 'Law Firm, Perusahaan Publik, Lembaga Negara', 'Rp 8.500.000 - Rp 35.000.000 / bulan', '["Lulus Ujian Profesi Advokat (UPA)","Penyusunan Kontrak (Legal Drafting)","Hukum Korporasi"]', 'Tinggi'),
(13, 'Diplomat & Staf Hubungan Internasional', 'Mewakili kepentingan kedaulatan negara dalam forum bilateral/multilateral (PBB, ASEAN) dan negosiasi traktat.', 'Kementerian Luar Negeri, Organisasi Internasional', 'Rp 8.000.000 - Rp 28.000.000 / bulan', '["Diplomatic Protocol","Kefasihan Bahasa Asing","Analisis Geopolitik Global"]', 'Stabil'),
(14, 'Psikolog Klinis & Konselor Kesehatan Mental', 'Melakukan asesmen psikologis, tes kepribadian kognitif, dan sesi psikoterapi untuk menangani gangguan mental emosional.', 'Klinik Psikologi, Rumah Sakit Jiwa, Praktik Mandiri', 'Rp 6.500.000 - Rp 18.000.000 / bulan', '["Surat Izin Praktik Psikolog (SIPP)","Tes Alat Ukur Psikologis (WAIS/MMPI)","Konseling Empati"]', 'Sangat Tinggi'),
(15, 'UI/UX Designer & Product Designer', 'Merancang arsitektur informasi, user flow, wireframe, prototipe interaktif, dan visual estetis produk digital.', 'Tech Companies, Creative Agency, Startups', 'Rp 7.500.000 - Rp 22.000.000 / bulan', '["Figma / Prototyping","Design System","User Research & Testing","Visual Hierarchy"]', 'Sangat Tinggi');

-- Insert Relasi Jurusan dan Karir
INSERT INTO `jurusan_karir` (`id`, `id_jurusan`, `id_karir`) VALUES
(1, 1, 1), (2, 1, 2), (3, 1, 3),
(4, 2, 4), (5, 2, 5),
(6, 3, 6), (7, 3, 1),
(8, 4, 7),
(9, 5, 8), (10, 5, 11),
(11, 6, 9),
(12, 7, 10),
(13, 8, 11), (14, 8, 8),
(15, 9, 12),
(16, 10, 13), (17, 10, 9),
(18, 11, 14),
(19, 12, 15);

-- Insert Nilai Siswa
INSERT INTO `nilai_siswa` (`id`, `id_user`, `id_mata_pelajaran`, `nilai`) VALUES
-- Siswa 1 (Sakhiy)
(1, 1, 1, 88.00), (2, 1, 2, 86.00), (3, 1, 3, 92.00), (4, 1, 4, 85.00), (5, 1, 5, 84.00),
(6, 1, 6, 94.00), (7, 1, 7, 90.00), (8, 1, 8, 82.00), (9, 1, 9, 80.00), (10, 1, 10, 96.00),
(11, 1, 11, 78.00), (12, 1, 12, 80.00), (13, 1, 13, 76.00), (14, 1, 14, 88.00),
-- Siswa 2 (Salsa)
(15, 2, 1, 85.00), (16, 2, 2, 88.00), (17, 2, 3, 90.00), (18, 2, 4, 86.00), (19, 2, 5, 82.00),
(20, 2, 6, 84.00), (21, 2, 7, 83.00), (22, 2, 8, 95.00), (23, 2, 9, 97.00), (24, 2, 10, 81.00),
(25, 2, 11, 79.00), (26, 2, 12, 83.00), (27, 2, 13, 78.00), (28, 2, 14, 87.00),
-- Siswa 3 (Kahla)
(29, 3, 1, 86.00), (30, 3, 2, 94.00), (31, 3, 3, 91.00), (32, 3, 4, 92.00), (33, 3, 5, 88.00),
(34, 3, 6, 70.00), (35, 3, 7, 72.00), (36, 3, 8, 71.00), (37, 3, 9, 75.00), (38, 3, 10, 78.00),
(39, 3, 11, 96.00), (40, 3, 12, 95.00), (41, 3, 13, 89.00), (42, 3, 14, 88.00);

-- Insert Hasil Rekomendasi Awal
INSERT INTO `hasil_rekomendasi` (`id`, `id_user`, `id_jurusan`, `total_skor`, `persentase_kecocokan`, `ranking`) VALUES
(1, 1, 1, 9310.00, 93.10, 1),
(2, 1, 3, 9210.00, 92.10, 2),
(3, 1, 12, 8930.00, 89.30, 3),
(4, 2, 2, 9295.00, 92.95, 1),
(5, 2, 4, 9210.00, 92.10, 2),
(6, 2, 11, 8960.00, 89.60, 3),
(7, 3, 8, 9300.00, 93.00, 1),
(8, 3, 9, 9265.00, 92.65, 2),
(9, 3, 6, 9260.00, 92.60, 3);
