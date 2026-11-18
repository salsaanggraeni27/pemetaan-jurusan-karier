---
name: sman1-project-standard
description: >-
  Standard architecture, MySQL schema conventions, entity typing, and feature workflow
  for the SMAN 1 Bandung Pemetaan Jurusan & Karier web application. Use this skill whenever
  adding or modifying database tables, TypeScript entities, API routes, Rule-Based Matching logic,
  Career Linker mappings, or Siswa/Guru BK pages.
---

# SMAN 1 Bandung — Project Development Standard & Runbook

Follow this runbook whenever extending or refactoring features in `pemetaan-jurusan-karier`.

---

## 1. Database & Entity Standard

### Uniform MySQL Schema (`database/schema.sql`)
All 8 tables in `sman1_mapping_jurusan` follow a strict uniform convention:

| Table | Primary Key | Foreign Keys | Notes |
| :--- | :--- | :--- | :--- |
| `users` | `id` | — | `role`: `'SISWA' \| 'GURU_BK'`, unique `nisn_nip` |
| `mata_pelajaran` | `id` | — | `kategori`: `'Wajib' \| 'Peminatan MIPA' \| 'Peminatan IPS' \| 'Peminatan Bahasa'` |
| `jurusan` | `id` | — | `universitas_favorit` stored as JSON string array |
| `aturan_bobot` | `id` | `id_jurusan`, `id_mata_pelajaran` | Unique `(id_jurusan, id_mata_pelajaran)` |
| `karir` | `id` | — | `kualifikasi_utama` stored as JSON string array |
| `jurusan_karir` | `id` | `id_jurusan`, `id_karir` | M:N junction table; unique `(id_jurusan, id_karir)` |
| `nilai_siswa` | `id` | `id_user`, `id_mata_pelajaran` | Unique `(id_user, id_mata_pelajaran)` |
| `hasil_rekomendasi` | `id` | `id_user`, `id_jurusan` | Ranked output from Rule-Based Matching Engine |

### Adding or Modifying an Entity
1. **Update SQL Schema:** Update both `database/schema.sql` and the bootstrap DDL in `lib/mysql.ts` (`initializeSchemaIfNeeded`).
2. **Update Canonical Types:** Add or update the TypeScript interface in `types/index.ts` using `id: number` for PK and `id_<entity>: number` for FKs.
3. **Add Data Access Methods:** Implement async query functions in `lib/db.ts` using `ensureMySQLInitialized()`. Wrap multi-row updates in `conn.beginTransaction()` / `conn.commit()` / `conn.rollback()`.
4. **Preserve Rollback Compatibility:** Do not delete `lib/seed-data.ts`, `lib/db-json-backup.ts`, or `data/sman1_data.json`.

---

## 2. Adding or Updating an API Route (`app/api/<resource>/route.ts`)

1. Import `{ db } from '@/lib/db'`.
2. Add `export const dynamic = 'force-dynamic';` at the top of the route file so Next.js does not statically cache `GET` responses during build.
3. `await` all `db.*` calls and return `{ success: true, data }` or `{ success: false, message }` with the proper HTTP status code.

---

## 3. Adding or Updating Pages (`app/admin/*` & `app/siswa/*`)

1. **Role Layouts:**
   - `/admin/*` pages are automatically guarded by `app/admin/layout.tsx` (`role === 'GURU_BK'`).
   - `/siswa/*` pages are automatically guarded by `app/siswa/layout.tsx` (`role === 'SISWA'`).
2. **Navigation:**
   - Register any new top-level page in both the desktop and mobile menus inside `components/Navbar.tsx`.
3. **Next.js 14 Suspense Rule:**
   - Any Client Component using `useSearchParams()` must be wrapped in `<Suspense fallback={...}>` so `npm run build` succeeds without prerender errors.

---

## 4. Verification Checklist

Before finishing any code change:
1. Run TypeScript validation:
   ```powershell
   npx tsc --noEmit
   ```
2. Verify that new or modified `Jurusan` entries have both:
   - Linked careers in `jurusan_karir` (via `/admin/jurusan` or `/admin/karir`).
   - Subject weight rules totaling `100%` in `aturan_bobot` (via `/admin/matriks-bobot`).
