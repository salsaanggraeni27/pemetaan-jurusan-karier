-- =========================================================================
-- SISTEM PEMETAAN JURUSAN & PROSPEK KARIR BERBASIS NILAI AKADEMIK
-- SMAN 1 BANDUNG - IFB-401 MANAJEMEN PROJEK GRUP A5
-- DDL & DML Schema MySQL Relational Database
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `sman1_mapping_jurusan` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sman1_mapping_jurusan`;

-- 1. Tabel users
DROP TABLE IF EXISTS `hasil_rekomendasi`;
DROP TABLE IF EXISTS `relasi_jurusan_karir`;
DROP TABLE IF EXISTS `aturan_bobot`;
DROP TABLE IF EXISTS `nilai_siswa`;
DROP TABLE IF EXISTS `karir`;
DROP TABLE IF EXISTS `jurusan`;
DROP TABLE IF EXISTS `mata_pelajaran`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nisn_nip` VARCHAR(50) NOT NULL UNIQUE,
  `nama` VARCHAR(150) NOT NULL,
  `role` ENUM('SISWA', 'GURU_BK') NOT NULL DEFAULT 'SISWA',
  `kelas` VARCHAR(50) NULL,
  `email` VARCHAR(100) NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel mata_pelajaran
CREATE TABLE `mata_pelajaran` (
  `id_mapel` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_mapel` VARCHAR(100) NOT NULL,
  `kategori` ENUM('Wajib', 'Peminatan MIPA', 'Peminatan IPS', 'Peminatan Bahasa') NOT NULL,
  `deskripsi` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel jurusan
CREATE TABLE `jurusan` (
  `id_jurusan` INT AUTO_INCREMENT PRIMARY KEY,
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
  `id_rule` INT AUTO_INCREMENT PRIMARY KEY,
  `id_jurusan` INT NOT NULL,
  `id_mapel` INT NOT NULL,
  `bobot` DECIMAL(5,2) NOT NULL COMMENT 'Bobot kepentingan mapel (persen)',
  CONSTRAINT `fk_rule_jurusan` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan`(`id_jurusan`) ON DELETE CASCADE,
  CONSTRAINT `fk_rule_mapel` FOREIGN KEY (`id_mapel`) REFERENCES `mata_pelajaran`(`id_mapel`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel karir
CREATE TABLE `karir` (
  `id_karir` INT AUTO_INCREMENT PRIMARY KEY,
  `profesi` VARCHAR(150) NOT NULL,
  `deskripsi` TEXT NOT NULL,
  `industri` VARCHAR(150) NOT NULL,
  `estimasi_gaji` VARCHAR(100) NOT NULL,
  `kualifikasi_utama` TEXT NOT NULL,
  `prospek_masa_depan` ENUM('Sangat Tinggi', 'Tinggi', 'Stabil') NOT NULL DEFAULT 'Tinggi',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabel relasi_jurusan_karir (Career Linker Module)
CREATE TABLE `relasi_jurusan_karir` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_jurusan` INT NOT NULL,
  `id_karir` INT NOT NULL,
  CONSTRAINT `fk_relasi_jurusan` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan`(`id_jurusan`) ON DELETE CASCADE,
  CONSTRAINT `fk_relasi_karir` FOREIGN KEY (`id_karir`) REFERENCES `karir`(`id_karir`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tabel nilai_siswa
CREATE TABLE `nilai_siswa` (
  `id_nilai` INT AUTO_INCREMENT PRIMARY KEY,
  `id_siswa` INT NOT NULL,
  `id_mapel` INT NOT NULL,
  `nilai` DECIMAL(5,2) NOT NULL,
  CONSTRAINT `fk_nilai_siswa` FOREIGN KEY (`id_siswa`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_nilai_mapel` FOREIGN KEY (`id_mapel`) REFERENCES `mata_pelajaran`(`id_mapel`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Tabel hasil_rekomendasi
CREATE TABLE `hasil_rekomendasi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_siswa` INT NOT NULL,
  `id_jurusan` INT NOT NULL,
  `total_skor` DECIMAL(7,2) NOT NULL,
  `persentase_kecocokan` DECIMAL(5,2) NOT NULL,
  `ranking` INT NOT NULL,
  `tanggal_analisis` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rekom_siswa` FOREIGN KEY (`id_siswa`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rekom_jurusan` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan`(`id_jurusan`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================================
-- SEED DATA AWAL SMAN 1 BANDUNG
-- =========================================================================

-- Insert Users
INSERT INTO `users` (`id`, `nisn_nip`, `nama`, `role`, `kelas`, `email`, `password`) VALUES
(1, '152023004', 'Sakhiy Amru Abdillah', 'SISWA', 'XII-MIPA 1', 'sakhiy@sman1bdg.sch.id', 'password123'),
(2, '152023012', 'Ni Made Dwi Salsa Anggraeni', 'SISWA', 'XII-MIPA 2', 'salsa@sman1bdg.sch.id', 'password123'),
(3, '152023039', 'Kahla Arsyaba', 'SISWA', 'XII-IPS 1', 'kahla@sman1bdg.sch.id', 'password123'),
(100, '197805122002122001', 'Dra. Hj. Ratna Juwita, M.Pd', 'GURU_BK', 'Koordinator Guru BK SMAN 1 Bandung', 'ratna.bk@sman1bdg.sch.id', 'adminbk123'),
(101, 'admin', 'Admin BK SMAN 1 Bandung', 'GURU_BK', 'Unit Layanan Bimbingan & Konseling', 'admin.bk@sman1bdg.sch.id', 'admin');

-- Insert Mata Pelajaran
INSERT INTO `mata_pelajaran` (`id_mapel`, `nama_mapel`, `kategori`, `deskripsi`) VALUES
(1, 'Matematika Umum', 'Wajib', 'Aljabar, trigonometri, dan logika matematika.'),
(2, 'Bahasa Indonesia', 'Wajib', 'Struktur teks, retorika, sintaksis, dan literasi kritis.'),
(3, 'Bahasa Inggris', 'Wajib', 'Reading comprehension, structure, global writing skills.'),
(4, 'Pendidikan Pancasila / PPKn', 'Wajib', 'Konstitusi negara, tata kelola hukum, etika kebangsaan.'),
(5, 'Sejarah Indonesia', 'Wajib', 'Peradaban nusantara dan kronologi perjuangan kemerdekaan.'),
(6, 'Matematika Tingkat Lanjut', 'Peminatan MIPA', 'Kalkulus diferensial-integral, vektor, dan matriks.'),
(7, 'Fisika', 'Peminatan MIPA', 'Mekanika kuantum, gelombang, kelistrikan, dan termodinamika.'),
(8, 'Kimia', 'Peminatan MIPA', 'Stoikiometri, larutan asam basa, dan kimia karbon.'),
(9, 'Biologi', 'Peminatan MIPA', 'Genetika, anatomi organisme, fisiologi, dan ekosistem.'),
(10, 'Informatika', 'Peminatan MIPA', 'Pemikiran komputasional, algoritma, pemrograman dasar.'),
(11, 'Ekonomi', 'Peminatan IPS', 'Akuntansi dasar, ekonomi makro/mikro, perbankan.'),
(12, 'Sosiologi', 'Peminatan IPS', 'Struktur sosial, konflik masyarakat, penelitian sosial.'),
(13, 'Geografi', 'Peminatan IPS', 'Sistem Informasi Geospasial (SIG), biosfer, dan demografi.'),
(14, 'Bahasa & Sastra Inggris', 'Peminatan Bahasa', 'Linguistik terapan, kajian novel/esai berbahasa Inggris.');

-- Insert Jurusan
INSERT INTO `jurusan` (`id_jurusan`, `nama_jurusan`, `rumpun`, `fakultas`, `deskripsi`, `daya_tampung`, `passing_grade_indikatif`, `universitas_favorit`) VALUES
(1, 'Teknik Informatika / Ilmu Komputer', 'Saintek', 'Fakultas Teknik & Ilmu Komputer', 'Rekayasa perangkat lunak, sistem cerdas, arsitektur cloud, dan keamanan siber.', 120, 87.50, 'ITB, UI, UGM, ITS'),
(2, 'Kedokteran Umum', 'Saintek', 'Fakultas Kedokteran', 'Pendidikan medis klinis, anatomi, patologi, dan farmakoterapi penyakit manusia.', 100, 89.00, 'Unpad, UI, UGM, Unair'),
(3, 'Teknik Elektro', 'Saintek', 'Fakultas Teknik Elektro', 'Sistem tenaga listrik, elektronika telekomunikasi, dan otomatisasi robotika.', 95, 83.50, 'ITB, ITENAS, UI, Undip'),
(4, 'Farmasi', 'Saintek', 'Fakultas Farmasi', 'Sains obat-obatan sintesis dan herbal, formulasi steril, dan uji klinis kefarmasian.', 80, 84.00, 'Unpad, ITB, UGM'),
(5, 'Teknik Industri', 'Saintek', 'Fakultas Rekayasa Industri', 'Perancangan dan optimasi sistem logistik rantai pasok dan produktivitas manufaktur.', 110, 82.00, 'ITB, UI, ITS'),
(6, 'Ilmu Komunikasi', 'Soshum', 'Fakultas Ilmu Komunikasi', 'Manajemen hubungan masyarakat (PR), media penyiaran, jurnalistik digital, branding.', 130, 85.00, 'Unpad, UI, UGM'),
(7, 'Akuntansi', 'Soshum', 'Fakultas Ekonomi dan Bisnis', 'Audit laporan keuangan, perpajakan, corporate finance, dan sistem informasi akuntansi.', 140, 86.00, 'Unpad, UI, UGM, UB'),
(8, 'Manajemen Bisnis', 'Soshum', 'Fakultas Ekonomi dan Bisnis', 'Strategi pemasaran, kewirausahaan, keuangan korporasi, dan manajemen operasi.', 150, 84.50, 'UI, Unpad, SBM ITB'),
(9, 'Ilmu Hukum', 'Soshum', 'Fakultas Hukum', 'Norma konstitusi, hukum perdata bisnis, peradilan pidana, dan arbitrase komersial.', 160, 85.50, 'Unpad, UI, UGM'),
(10, 'Hubungan Internasional', 'Soshum', 'Fakultas Ilmu Sosial dan Ilmu Politik', 'Diplomasi multilateral, perundingan traktat internasional, dan analisis geopolitik.', 70, 87.00, 'UI, UGM, Unpad'),
(11, 'Psikologi', 'Campuran', 'Fakultas Psikologi', 'Psikometri kognitif, konseling kepribadian, dan dinamika psikologi industri organisasi.', 120, 86.50, 'Unpad, UI, UPI'),
(12, 'Desain Komunikasi Visual (DKV)', 'Campuran', 'Fakultas Seni Rupa dan Desain', 'Komunikasi visual grafis, motion design, interaksi UI/UX, dan ilustrasi digital.', 85, 83.00, 'ITB, ITENAS, Telkom University');

-- Insert Aturan Bobot Mapel
INSERT INTO `aturan_bobot` (`id_jurusan`, `id_mapel`, `bobot`) VALUES
(1, 6, 30.00), (1, 10, 30.00), (1, 3, 15.00), (1, 7, 15.00), (1, 1, 10.00),
(2, 9, 35.00), (2, 8, 30.00), (2, 3, 15.00), (2, 7, 10.00), (2, 1, 10.00),
(3, 7, 35.00), (3, 6, 30.00), (3, 10, 15.00), (3, 3, 10.00), (3, 1, 10.00),
(4, 8, 40.00), (4, 9, 30.00), (4, 1, 15.00), (4, 3, 15.00),
(5, 6, 25.00), (5, 1, 20.00), (5, 7, 20.00), (5, 11, 20.00), (5, 3, 15.00),
(6, 2, 35.00), (6, 3, 25.00), (6, 12, 25.00), (6, 5, 15.00),
(7, 11, 40.00), (7, 1, 30.00), (7, 3, 15.00), (7, 2, 15.00),
(8, 11, 35.00), (8, 12, 25.00), (8, 3, 25.00), (8, 1, 15.00),
(9, 4, 35.00), (9, 2, 25.00), (9, 12, 25.00), (9, 5, 15.00),
(10, 3, 35.00), (10, 14, 25.00), (10, 12, 20.00), (10, 13, 20.00),
(11, 9, 30.00), (11, 12, 30.00), (11, 1, 20.00), (11, 3, 20.00),
(12, 10, 30.00), (12, 2, 25.00), (12, 3, 25.00), (12, 12, 20.00);

-- Insert Karir
INSERT INTO `karir` (`id_karir`, `profesi`, `deskripsi`, `industri`, `estimasi_gaji`, `kualifikasi_utama`, `prospek_masa_depan`) VALUES
(1, 'Software Engineer / Fullstack Developer', 'Merancang, membangun, dan memelihara aplikasi web platform dan backend enterprise.', 'Teknologi Informasi, FinTech', 'Rp 8.000.000 - Rp 25.000.000 / bulan', 'Next.js, Node.js, Database SQL, Git', 'Sangat Tinggi'),
(2, 'Data Scientist & AI Specialist', 'Menganalisis big data, memodelkan machine learning, dan mengekstrak insight bisnis strategis.', 'Teknologi, Finansial, E-Commerce', 'Rp 10.000.000 - Rp 30.000.000 / bulan', 'Python, Statistika Terapan, Machine Learning, SQL', 'Sangat Tinggi'),
(3, 'Cybersecurity Analyst', 'Melindungi arsitektur jaringan dan sistem aplikasi dari ancaman serangan siber.', 'Perbankan, BUMN, SaaS', 'Rp 9.000.000 - Rp 27.000.000 / bulan', 'Penetration Testing, Kriptografi, Network Security', 'Sangat Tinggi'),
(4, 'Dokter Umum & Klinis', 'Melakukan anamnesis, diagnosis, terapi klinis, dan pertolongan darurat pada pasien.', 'Rumah Sakit, Klinik Pratama', 'Rp 8.000.000 - Rp 22.000.000 / bulan', 'STR Dokter, Diagnosis Medis, Etika Klinis', 'Tinggi'),
(5, 'Dokter Spesialis', 'Menangani kasus medis kompleks pada bidang spesialisasi tertentu dengan teknologi kedokteran.', 'Rumah Sakit Rujukan, Pusat Penelitian', 'Rp 25.000.000 - Rp 70.000.000 / bulan', 'Lulusan PPDS, Tindakan Bedah / Intervensi Khusus', 'Sangat Tinggi'),
(6, 'Electrical Systems Engineer', 'Merancang instalasi pembangkit tenaga listrik, distribusi gardu induk, dan transmisi daya.', 'PLN, EPC BUMN, Energi Terbarukan', 'Rp 7.500.000 - Rp 20.000.000 / bulan', 'Sistem Daya, Simulasi Rangkaian, Standar K3 Listrik', 'Tinggi'),
(7, 'Apoteker Industri & Formulator', 'Memimpin riset formulasi obat (R&D), kontrol kualitas (QC), dan validasi metode CPOB.', 'Farmasi Multinasional, Kosmetik', 'Rp 7.000.000 - Rp 18.000.000 / bulan', 'SIPA, Kimia Analitik, Regulasi BPOM', 'Tinggi'),
(8, 'Supply Chain & Operations Manager', 'Mengelola efisiensi rantai pasok manufaktur, logistik pergudangan, dan continuous improvement.', 'FMCG, Manufaktur Otomotif', 'Rp 8.500.000 - Rp 26.000.000 / bulan', 'Six Sigma, Lean Supply Chain, ERP SAP', 'Tinggi'),
(9, 'Public Relations (PR) Specialist', 'Membangun reputasi positif instansi, membina hubungan pers, dan komunikasi krisis.', 'Agensi PR, Korporasi Multinasional', 'Rp 6.500.000 - Rp 18.000.000 / bulan', 'Media Relations, Crisis Communication, Press Release', 'Tinggi'),
(10, 'Akuntan Publik & Auditor Finansial', 'Memeriksa validitas laporan keuangan entitas korporat sesuai standar PSAK dan IFRS.', 'KAP Big 4, Sektor Keuangan', 'Rp 7.500.000 - Rp 25.000.000 / bulan', 'Sertifikasi CPA / CA, Financial Audit, Perpajakan', 'Tinggi'),
(11, 'Business Development Analyst', 'Menganalisis potensi diversifikasi pasar, proyeksi valuasi bisnis, dan kemitraan strategis.', 'Venture Capital, Fintech, Korporat', 'Rp 8.000.000 - Rp 24.000.000 / bulan', 'Financial Modeling, Pitching, Business Strategy', 'Tinggi'),
(12, 'Advokat & Corporate Legal Counsel', 'Menyusun kontrak komersial, mitigasi kepatuhan hukum korporasi, dan litigasi persidangan.', 'Law Firm, Lembaga BUMN, Multinasional', 'Rp 8.500.000 - Rp 35.000.000 / bulan', 'Lulus UPA, Legal Drafting, Hukum Bisnis', 'Tinggi'),
(13, 'Diplomat & Analis Hubungan Luar Negeri', 'Mewakili kepentingan diplomatik negara dalam forum multilateral dan perundingan traktat.', 'Kemenlu RI, Badan PBB, Diplomatic Mission', 'Rp 8.000.000 - Rp 28.000.000 / bulan', 'Diplomatic Etiquette, Negosiasi Bahasa Asing, Geopolitik', 'Stabil'),
(14, 'Psikolog Klinis & Konselor Mental', 'Melakukan asesmen psikodiagnostik, tes psikologi, dan konseling intervensi kognitif emosional.', 'Klinik Psikologi, RS Jiwa, Konsultan SDM', 'Rp 6.500.000 - Rp 18.000.000 / bulan', 'SIPP, Tes Psikometri WAIS/MMPI, Pendampingan Empatik', 'Sangat Tinggi'),
(15, 'UI/UX Designer & Product Designer', 'Merancang wireframe, user flow interaktif, sistem desain, dan prototipe produk digital teruji.', 'Tech Startups, Creative Studio', 'Rp 7.500.000 - Rp 22.000.000 / bulan', 'Figma, Design System, Usability Testing, Visual UI', 'Sangat Tinggi');

-- Relasi Jurusan dan Karir
INSERT INTO `relasi_jurusan_karir` (`id_jurusan`, `id_karir`) VALUES
(1, 1), (1, 2), (1, 3),
(2, 4), (2, 5),
(3, 6), (3, 1),
(4, 7),
(5, 8), (5, 11),
(6, 9),
(7, 10),
(8, 11), (8, 8),
(9, 12),
(10, 13), (10, 9),
(11, 14),
(12, 15);

