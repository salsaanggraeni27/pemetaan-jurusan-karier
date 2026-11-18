/**
 * Canonical Domain & Database Entities
 * Mirrors the uniform MySQL schema in `database/schema.sql`.
 */

export type UserRole = 'SISWA' | 'GURU_BK';

export type KategoriMapel =
  | 'Wajib'
  | 'Peminatan MIPA'
  | 'Peminatan IPS'
  | 'Peminatan Bahasa';

export type RumpunJurusan = 'Saintek' | 'Soshum' | 'Campuran';

export type ProspekMasaDepan = 'Sangat Tinggi' | 'Tinggi' | 'Stabil';

export interface User {
  id: number;
  nisn_nip: string;
  nama: string;
  role: UserRole;
  kelas?: string;
  email?: string;
  password?: string;
  created_at?: string;
}

export interface MataPelajaran {
  id: number;
  nama_mapel: string;
  kategori: KategoriMapel;
  deskripsi?: string;
  created_at?: string;
  /** @deprecated Legacy alias for rollback compatibility; prefer `id` */
  id_mapel?: number;
}

export interface Jurusan {
  id: number;
  nama_jurusan: string;
  rumpun: RumpunJurusan;
  fakultas: string;
  deskripsi: string;
  daya_tampung: number;
  passing_grade_indikatif: number;
  universitas_favorit: string[];
  created_at?: string;
  /** @deprecated Legacy alias for rollback compatibility; prefer `id` */
  id_jurusan?: number;
}

export interface AturanBobot {
  id: number;
  id_jurusan: number;
  id_mata_pelajaran: number;
  bobot: number;
  created_at?: string;
  /** @deprecated Legacy aliases for rollback compatibility */
  id_rule?: number;
  id_mapel?: number;
}

export interface Karir {
  id: number;
  profesi: string;
  deskripsi: string;
  industri: string;
  estimasi_gaji: string;
  kualifikasi_utama: string[];
  prospek_masa_depan: ProspekMasaDepan;
  created_at?: string;
  /** @deprecated Legacy alias for rollback compatibility; prefer `id` */
  id_karir?: number;
}

export interface JurusanKarir {
  id: number;
  id_jurusan: number;
  id_karir: number;
  created_at?: string;
}

export type RelasiJurusanKarir = JurusanKarir;

export interface NilaiSiswa {
  id: number;
  id_user: number;
  id_mata_pelajaran: number;
  nilai: number;
  created_at?: string;
  /** @deprecated Legacy aliases for rollback compatibility */
  id_nilai?: number;
  id_siswa?: number;
  id_mapel?: number;
}

export interface HasilRekomendasi {
  id: number;
  id_user: number;
  id_jurusan: number;
  total_skor: number;
  persentase_kecocokan: number;
  ranking: number;
  tanggal_analisis: string;
  created_at?: string;
  /** @deprecated Legacy alias for rollback compatibility; prefer `id_user` */
  id_siswa?: number;
}
