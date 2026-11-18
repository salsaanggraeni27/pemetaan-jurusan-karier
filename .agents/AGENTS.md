# SMAN 1 Bandung — Pemetaan Jurusan & Karier Project Rules

Always adhere to these project standards when inspecting, modifying, or extending this repository:

## 1. Architecture & Directory Structure
- **Framework:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, MySQL (`mysql2/promise`).
- **Canonical Types (`types/index.ts`):** Always import domain interfaces (`User`, `MataPelajaran`, `Jurusan`, `AturanBobot`, `Karir`, `JurusanKarir`, `NilaiSiswa`, `HasilRekomendasi`) from `@/types`. Never define duplicate ad-hoc interfaces inside pages or components.
- **Database Layer (`lib/mysql.ts` & `lib/db.ts`):**
  - All database queries must go through `lib/db.ts` using parameterized SQL via `ensureMySQLInitialized()`.
  - Do not import `mysql2` directly inside `app/api/*` or React components.
  - Keep `lib/seed-data.ts`, `data/sman1_data.json`, and `lib/db-json-backup.ts` intact as the offline rollback option unless explicitly instructed to remove them.
- **Business Logic (`lib/rule-engine.ts` & `lib/career-linker.ts`):**
  - Keep the Rule-Based Matching calculation pure inside `lib/rule-engine.ts`.
  - Keep career mapping transformations inside `lib/career-linker.ts`.

## 2. Uniform Database & Entity Naming Standard
- **Table Names:** Singular `snake_case` in Indonesian, except `users`:
  - `users`, `mata_pelajaran`, `jurusan`, `aturan_bobot`, `karir`, `jurusan_karir`, `nilai_siswa`, `hasil_rekomendasi`.
- **Primary Keys:** Every table and TypeScript entity uses `id` (`INT AUTO_INCREMENT PRIMARY KEY` in SQL, `id: number` in TypeScript).
- **Foreign Keys:** Always `id_<referenced_entity>`:
  - `id_user` (references `users.id`)
  - `id_mata_pelajaran` (references `mata_pelajaran.id`)
  - `id_jurusan` (references `jurusan.id`)
  - `id_karir` (references `karir.id`)
- **Constraints:** Prefix unique constraints with `uq_<table>_<cols>` and foreign keys with `fk_<table>_<target>`.

## 3. Role Separation & Access Control
- **Guru BK (`role === 'GURU_BK'`, routes under `/admin/*`):**
  - Protected by `app/admin/layout.tsx`.
  - Exclusive authority to input/edit student grades (`/admin/input-nilai`), configure subject weights (`/admin/matriks-bobot`), and manage master data (`/admin/jurusan`, `/admin/karir`, `/admin/mapel`).
- **Siswa (`role === 'SISWA'`, routes under `/siswa/*`):**
  - Protected by `app/siswa/layout.tsx`.
  - Read-only access to verified grades (`/siswa/input-nilai`), major recommendations (`/siswa/rekomendasi`), career exploration (`/siswa/eksplorasi-karir`), and printable BK sheets (`/siswa/cetak`).

## 4. API Route Conventions (`app/api/**`)
- All API routes that query the database without reading `request.url` must export `export const dynamic = 'force-dynamic';`.
- Always return JSON shaped as `{ success: boolean, data?: ..., message?: string }` with appropriate HTTP status codes (`400` validation, `401`/`404` auth, `500` server error).
- Multi-statement writes (`updateAturanBobotForJurusan`, `setRelasiForJurusan`, `setRelasiForKarir`, `saveNilaiSiswaAndCalculate`) must run inside a MySQL transaction (`beginTransaction` / `commit` / `rollback`).
