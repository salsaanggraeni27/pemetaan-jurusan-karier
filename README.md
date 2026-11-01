# Rancang Bangun Aplikasi Web Mapping Jurusan Pendidikan Tinggi dan Prospek Karir Berbasis Nilai Akademik di SMAN 1 Bandung

**Tugas MK:** IFB-401 Manajemen Projek • TA 2026-2027  
**Program Studi:** Informatika, Fakultas Teknologi Industri  
**Institusi:** Institut Teknologi Nasional Bandung (ITENAS)  
**Mitra:** SMA Negeri 1 Bandung (Jl. Ir. H. Juanda No. 93, Bandung)  

### Disusun oleh Grup – A5:
1. **Sakhiy Amru Abdillah** (152023004) – *Project Manager & System Analyst*
2. **Ni Made Dwi Salsa Anggraeni** (152023012) – *Frontend Developer*
3. **Kahla Arsyaba** (152023039) – *Backend Developer*

---

## 📌 Latar Belakang & Urgensi

Permasalahan mendasar bagi siswa SMA Negeri 1 Bandung pada masa penentuan studi lanjut adalah kebingungan menentukan program studi perkuliahan yang realistis dengan rekam jejak nilai rapor mata pelajaran. Hal ini kerap berujung pada kegagalan seleksi masuk PTN (SNBP/SNBT) atau fenomena salah jurusan (*major mismatch*). Selain itu, keterbatasan panduan manual dan dokumen tertulis membuat Guru Bimbingan dan Konseling (BK) kewalahan menangani konsultasi satu per satu.

Aplikasi ini menghadirkan instrumen digital pemetaan jurusan berbasis **Rule-Based Matching** yang deterministik, transparan, dan terkomputerisasi, serta menghubungkannya langsung ke katalog prospek karir dunia kerja nyata melalui **Career Linker Service**.

---

## 🏗️ Arsitektur Sistem (3-Tier Architecture)

1. **Client Tier (Presentation Layer - Next.js & Tailwind CSS)**
   - **Antarmuka Siswa (Mobile-First):** Form input nilai rapor semester, kartu visualisasi peringkat rekomendasi jurusan, pohon eksplorasi profil karir, dan fitur cetak lembar rekomendasi resmi BK.
   - **Dashboard Guru BK (Desktop):** Manajemen matriks aturan pembobotan mata pelajaran per jurusan (*Rule-Based Matrix Configurator*), pemantauan hasil pemetaan seluruh siswa, dan manajemen data master (jurusan, profesi, mapel).

2. **Application Tier (Business Logic - Next.js App Router)**
   - **Auth & Session Guard:** Autentikasi dan pemisahan hak akses role Siswa vs Guru BK/Admin.
   - **Rule-Based Matching Engine:** Normalisasi nilai rapor dan kalkulasi skor kecocokan jurusan dengan formula pembobotan:
     $$\text{Skor Jurusan}(J) = \sum_{i=1}^{n} \text{Nilai Mapel}_i \times \text{Bobot Mapel}_{i,j}$$
   - **Career Linker Service:** Menghubungkan jurusan rekomendasi teratas dengan profil profesi karir, rentang estimasi gaji industri di Indonesia, dan kualifikasi keahlian yang dibutuhkan.

3. **Data Tier (Relational Persistence Layer - MySQL)**
   - Skema basis data relasional: `users`, `mata_pelajaran`, `nilai_siswa`, `jurusan`, `aturan_bobot`, `karir`, `relasi_jurusan_karir`, dan `hasil_rekomendasi`.
   - File DDL & DML lengkap siap pakai tersedia di [`database/schema.sql`](file:///c:/KULIAH/SEMESTER%207/MANPRO/PROJEK/database/schema.sql).
   - Dilengkapi dual-mode persistence: dapat berjalan otomatis langsung dengan *local storage persistence* atau terhubung ke server MySQL menggunakan kredensial `.env`.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Prasyarat
- Node.js (versi 18 ke atas)
- npm atau pnpm

### 2. Menjalankan Server Pengembangan (Development Mode)
Jalankan perintah berikut di terminal:
```bash
npm run dev
```
Aplikasi akan aktif dan dapat diakses di browser pada:
👉 **http://localhost:3000**

### 3. Build & Production Mode
```bash
npm run build
npm start
```

---

## 🔑 Akun Demo Pengujian Cepat

Sistem telah dilengkapi data awal (*seed data*) SMAN 1 Bandung dan tombol **Simulasi Cepat 1-Klik**:

| Role | Akun / Nama | NISN / NIP | Password | Keterangan Profil |
| :--- | :--- | :--- | :--- | :--- |
| **Siswa** | Sakhiy Amru Abdillah | `152023004` | `password123` | Kelas XII-MIPA 1 (Unggul di Informatika & Fisika) |
| **Siswa** | Ni Made Dwi Salsa A. | `152023012` | `password123` | Kelas XII-MIPA 2 (Unggul di Biologi & Kimia / Kedokteran) |
| **Siswa** | Kahla Arsyaba | `152023039` | `password123` | Kelas XII-IPS 1 (Unggul di Ekonomi, Sosiologi / Soshum) |
| **Guru BK** | Dra. Hj. Ratna Juwita, M.Pd | `197805122002122001` | `adminbk123` | Koordinator Bimbingan Konseling SMAN 1 Bandung |
| **Admin** | Admin BK SMAN 1 Bandung | `admin` | `admin` | Unit Pelaksana Teknis BK |

---

## 📂 Struktur Direktori Proyek

```
PROJEK/
├── app/
│   ├── layout.tsx                     # Layout utama aplikasi dengan Navbar & Footer
│   ├── page.tsx                       # Landing page Portal BK SMAN 1 Bandung
│   ├── login/page.tsx                 # Halaman login dual role (Siswa & Guru BK)
│   ├── siswa/
│   │   ├── page.tsx                   # Dashboard siswa (Status pemetaan & ringkasan)
│   │   ├── input-nilai/page.tsx       # Form responsif mobile-first nilai rapor
│   │   ├── rekomendasi/page.tsx       # Peringkat rekomendasi jurusan & transparansi rumus
│   │   ├── eksplorasi-karir/page.tsx  # Modul Career Linker (Katalog profesi & estimasi gaji)
│   │   └── cetak/page.tsx             # Lembar rekomendasi resmi BK (Siap cetak/PDF)
│   ├── admin/
│   │   ├── page.tsx                   # Dashboard Guru BK (Statistik & analitik minat)
│   │   ├── matriks-bobot/page.tsx     # Rule-Based Matrix Configurator (Slider bobot mapel)
│   │   ├── monitoring-siswa/page.tsx  # Tabel rekapitulasi & audit nilai seluruh siswa
│   │   ├── jurusan/page.tsx           # Master data program studi perkuliahan
│   │   ├── karir/page.tsx             # Master data profesi & karir industri
│   │   └── mapel/page.tsx             # Master data mata pelajaran rapor
│   └── api/                           # Endpoint REST API Next.js App Router
├── components/
│   ├── Navbar.tsx                     # Header navigasi responsif & role-switcher demo
│   └── Footer.tsx                     # Footer identitas SMAN 1 Bandung & Grup A5
├── lib/
│   ├── db.ts                          # Persistence DB engine (MySQL & local fallback)
│   ├── rule-engine.ts                 # Logika algoritma Rule-Based Matching
│   ├── career-linker.ts               # Service pemetaan relasi jurusan ke karir
│   └── seed-data.ts                   # Data awal terverifikasi SMAN 1 Bandung
├── database/
│   └── schema.sql                     # Script DDL/DML lengkap database MySQL
├── tailwind.config.ts                 # Konfigurasi Tailwind CSS
└── package.json                       # Dependensi dan script project
```

---

## 🗄️ Menghubungkan ke Database MySQL (Opsional)

Jika ingin menggunakan server MySQL (misal via XAMPP, Laragon, atau Cloud Hosting):
1. Buka phpMyAdmin atau terminal MySQL.
2. Buat database atau impor langsung file:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Sesuaikan file `.env` di root folder proyek:
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=
   MYSQL_DATABASE=sman1_mapping_jurusan
   ```
Aplikasi akan secara otomatis menggunakan database MySQL tersebut.
