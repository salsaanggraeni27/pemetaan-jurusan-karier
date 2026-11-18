import {
  MataPelajaran,
  Jurusan,
  AturanBobot,
  Karir,
  RelasiJurusanKarir,
  User,
  NilaiSiswa,
  HasilRekomendasi
} from './seed-data';
import { calculateJurusanRecommendations } from './rule-engine';
import { ensureMySQLInitialized, RowDataPacket, ResultSetHeader } from './mysql';

function parseStringArray(val: unknown): string[] {
  if (Array.isArray(val)) {
    return val.map(v => String(v).trim()).filter(Boolean);
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(v => String(v).trim()).filter(Boolean);
        }
      } catch {
        // Fallback to comma-separated string
      }
    }
    return trimmed.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function mapUserRow(row: RowDataPacket): User {
  return {
    id: Number(row.id),
    nisn_nip: String(row.nisn_nip),
    nama: String(row.nama),
    role: row.role as 'SISWA' | 'GURU_BK',
    kelas: row.kelas ?? undefined,
    email: row.email ?? undefined,
    password: row.password ?? undefined,
  };
}

function mapMapelRow(row: RowDataPacket): MataPelajaran {
  return {
    id_mapel: Number(row.id),
    nama_mapel: String(row.nama_mapel),
    kategori: row.kategori as MataPelajaran['kategori'],
    deskripsi: row.deskripsi ?? undefined,
  };
}

function mapJurusanRow(row: RowDataPacket): Jurusan {
  return {
    id_jurusan: Number(row.id),
    nama_jurusan: String(row.nama_jurusan),
    rumpun: row.rumpun as Jurusan['rumpun'],
    fakultas: String(row.fakultas),
    deskripsi: String(row.deskripsi),
    daya_tampung: Number(row.daya_tampung),
    passing_grade_indikatif: Number(row.passing_grade_indikatif),
    universitas_favorit: parseStringArray(row.universitas_favorit),
  };
}

function mapAturanBobotRow(row: RowDataPacket): AturanBobot {
  return {
    id_rule: Number(row.id),
    id_jurusan: Number(row.id_jurusan),
    id_mapel: Number(row.id_mata_pelajaran),
    bobot: Number(row.bobot),
  };
}

function mapKarirRow(row: RowDataPacket): Karir {
  return {
    id_karir: Number(row.id),
    profesi: String(row.profesi),
    deskripsi: String(row.deskripsi),
    industri: String(row.industri),
    estimasi_gaji: String(row.estimasi_gaji),
    kualifikasi_utama: parseStringArray(row.kualifikasi_utama),
    prospek_masa_depan: row.prospek_masa_depan as Karir['prospek_masa_depan'],
  };
}

function mapRelasiRow(row: RowDataPacket): RelasiJurusanKarir {
  return {
    id: Number(row.id),
    id_jurusan: Number(row.id_jurusan),
    id_karir: Number(row.id_karir),
  };
}

function mapNilaiRow(row: RowDataPacket): NilaiSiswa {
  return {
    id_nilai: Number(row.id),
    id_siswa: Number(row.id_user),
    id_mapel: Number(row.id_mata_pelajaran),
    nilai: Number(row.nilai),
  };
}

function mapHasilRekomendasiRow(row: RowDataPacket): HasilRekomendasi {
  return {
    id: Number(row.id),
    id_siswa: Number(row.id_user),
    id_jurusan: Number(row.id_jurusan),
    total_skor: Number(row.total_skor),
    persentase_kecocokan: Number(row.persentase_kecocokan),
    ranking: Number(row.ranking),
    tanggal_analisis: row.tanggal_analisis
      ? new Date(row.tanggal_analisis).toISOString()
      : new Date().toISOString(),
  };
}

export const db = {
  // USERS
  getUsers: async (): Promise<User[]> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM `users` ORDER BY `id` ASC');
    return rows.map(mapUserRow);
  },

  getUserById: async (id: number): Promise<User | undefined> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM `users` WHERE `id` = ? LIMIT 1', [id]);
    return rows[0] ? mapUserRow(rows[0]) : undefined;
  },

  getUserByNisnNip: async (nisn_nip: string): Promise<User | undefined> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM `users` WHERE LOWER(`nisn_nip`) = LOWER(?) LIMIT 1',
      [nisn_nip.trim()]
    );
    return rows[0] ? mapUserRow(rows[0]) : undefined;
  },

  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const pool = await ensureMySQLInitialized();
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO `users` (`nisn_nip`, `nama`, `role`, `kelas`, `email`, `password`) VALUES (?, ?, ?, ?, ?, ?)',
      [
        user.nisn_nip.trim(),
        user.nama,
        user.role,
        user.kelas || null,
        user.email || null,
        user.password || 'password123',
      ]
    );
    return { ...user, id: result.insertId };
  },

  // MATA PELAJARAN
  getMapel: async (): Promise<MataPelajaran[]> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM `mata_pelajaran` ORDER BY `id` ASC');
    return rows.map(mapMapelRow);
  },

  getMapelById: async (id: number): Promise<MataPelajaran | undefined> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM `mata_pelajaran` WHERE `id` = ? LIMIT 1', [id]);
    return rows[0] ? mapMapelRow(rows[0]) : undefined;
  },

  saveMapel: async (mapel: MataPelajaran): Promise<MataPelajaran> => {
    const pool = await ensureMySQLInitialized();
    if (mapel.id_mapel) {
      await pool.query(
        'UPDATE `mata_pelajaran` SET `nama_mapel` = ?, `kategori` = ?, `deskripsi` = ? WHERE `id` = ?',
        [mapel.nama_mapel, mapel.kategori, mapel.deskripsi || null, mapel.id_mapel]
      );
      return mapel;
    } else {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO `mata_pelajaran` (`nama_mapel`, `kategori`, `deskripsi`) VALUES (?, ?, ?)',
        [mapel.nama_mapel, mapel.kategori, mapel.deskripsi || null]
      );
      return { ...mapel, id_mapel: result.insertId };
    }
  },

  deleteMapel: async (id: number): Promise<boolean> => {
    const pool = await ensureMySQLInitialized();
    await pool.query('DELETE FROM `mata_pelajaran` WHERE `id` = ?', [id]);
    return true;
  },

  // JURUSAN
  getJurusan: async (): Promise<Jurusan[]> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM `jurusan` ORDER BY `id` ASC');
    return rows.map(mapJurusanRow);
  },

  getJurusanById: async (id: number): Promise<Jurusan | undefined> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM `jurusan` WHERE `id` = ? LIMIT 1', [id]);
    return rows[0] ? mapJurusanRow(rows[0]) : undefined;
  },

  saveJurusan: async (jurusan: Jurusan): Promise<Jurusan> => {
    const pool = await ensureMySQLInitialized();
    const univJson = JSON.stringify(parseStringArray(jurusan.universitas_favorit));
    if (jurusan.id_jurusan) {
      await pool.query(
        'UPDATE `jurusan` SET `nama_jurusan` = ?, `rumpun` = ?, `fakultas` = ?, `deskripsi` = ?, `daya_tampung` = ?, `passing_grade_indikatif` = ?, `universitas_favorit` = ? WHERE `id` = ?',
        [
          jurusan.nama_jurusan,
          jurusan.rumpun,
          jurusan.fakultas || '',
          jurusan.deskripsi || '',
          Number(jurusan.daya_tampung) || 50,
          Number(jurusan.passing_grade_indikatif) || 80,
          univJson,
          jurusan.id_jurusan,
        ]
      );
      return { ...jurusan, universitas_favorit: parseStringArray(jurusan.universitas_favorit) };
    } else {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO `jurusan` (`nama_jurusan`, `rumpun`, `fakultas`, `deskripsi`, `daya_tampung`, `passing_grade_indikatif`, `universitas_favorit`) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          jurusan.nama_jurusan,
          jurusan.rumpun,
          jurusan.fakultas || '',
          jurusan.deskripsi || '',
          Number(jurusan.daya_tampung) || 50,
          Number(jurusan.passing_grade_indikatif) || 80,
          univJson,
        ]
      );
      return {
        ...jurusan,
        id_jurusan: result.insertId,
        universitas_favorit: parseStringArray(jurusan.universitas_favorit),
      };
    }
  },

  deleteJurusan: async (id: number): Promise<boolean> => {
    const pool = await ensureMySQLInitialized();
    await pool.query('DELETE FROM `jurusan` WHERE `id` = ?', [id]);
    return true;
  },

  // ATURAN BOBOT
  getAturanBobot: async (): Promise<AturanBobot[]> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM `aturan_bobot` ORDER BY `id` ASC');
    return rows.map(mapAturanBobotRow);
  },

  getAturanBobotByJurusan: async (jurusanId: number): Promise<AturanBobot[]> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM `aturan_bobot` WHERE `id_jurusan` = ? ORDER BY `id` ASC',
      [jurusanId]
    );
    return rows.map(mapAturanBobotRow);
  },

  updateAturanBobotForJurusan: async (
    jurusanId: number,
    rules: { id_mapel: number; bobot: number }[]
  ): Promise<AturanBobot[]> => {
    const pool = await ensureMySQLInitialized();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query('DELETE FROM `aturan_bobot` WHERE `id_jurusan` = ?', [jurusanId]);
      for (const rule of rules) {
        if (Number(rule.bobot) > 0) {
          await conn.query(
            'INSERT INTO `aturan_bobot` (`id_jurusan`, `id_mata_pelajaran`, `bobot`) VALUES (?, ?, ?)',
            [jurusanId, rule.id_mapel, rule.bobot]
          );
        }
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
    return db.getAturanBobotByJurusan(jurusanId);
  },

  // KARIR
  getKarir: async (): Promise<Karir[]> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM `karir` ORDER BY `id` ASC');
    return rows.map(mapKarirRow);
  },

  getKarirById: async (id: number): Promise<Karir | undefined> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM `karir` WHERE `id` = ? LIMIT 1', [id]);
    return rows[0] ? mapKarirRow(rows[0]) : undefined;
  },

  saveKarir: async (karir: Karir): Promise<Karir> => {
    const pool = await ensureMySQLInitialized();
    const kualifikasiJson = JSON.stringify(parseStringArray(karir.kualifikasi_utama));
    if (karir.id_karir) {
      await pool.query(
        'UPDATE `karir` SET `profesi` = ?, `deskripsi` = ?, `industri` = ?, `estimasi_gaji` = ?, `kualifikasi_utama` = ?, `prospek_masa_depan` = ? WHERE `id` = ?',
        [
          karir.profesi,
          karir.deskripsi || '',
          karir.industri,
          karir.estimasi_gaji || '',
          kualifikasiJson,
          karir.prospek_masa_depan || 'Tinggi',
          karir.id_karir,
        ]
      );
      return { ...karir, kualifikasi_utama: parseStringArray(karir.kualifikasi_utama) };
    } else {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO `karir` (`profesi`, `deskripsi`, `industri`, `estimasi_gaji`, `kualifikasi_utama`, `prospek_masa_depan`) VALUES (?, ?, ?, ?, ?, ?)',
        [
          karir.profesi,
          karir.deskripsi || '',
          karir.industri,
          karir.estimasi_gaji || '',
          kualifikasiJson,
          karir.prospek_masa_depan || 'Tinggi',
        ]
      );
      return {
        ...karir,
        id_karir: result.insertId,
        kualifikasi_utama: parseStringArray(karir.kualifikasi_utama),
      };
    }
  },

  deleteKarir: async (id: number): Promise<boolean> => {
    const pool = await ensureMySQLInitialized();
    await pool.query('DELETE FROM `karir` WHERE `id` = ?', [id]);
    return true;
  },

  // RELASI JURUSAN KARIR (`jurusan_karir` table)
  getRelasiJurusanKarir: async (): Promise<RelasiJurusanKarir[]> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM `jurusan_karir` ORDER BY `id` ASC');
    return rows.map(mapRelasiRow);
  },

  setRelasiForJurusan: async (jurusanId: number, karirIds: number[]): Promise<boolean> => {
    const pool = await ensureMySQLInitialized();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query('DELETE FROM `jurusan_karir` WHERE `id_jurusan` = ?', [jurusanId]);
      for (const kId of Array.from(new Set(karirIds.map(Number).filter(Boolean)))) {
        await conn.query('INSERT INTO `jurusan_karir` (`id_jurusan`, `id_karir`) VALUES (?, ?)', [jurusanId, kId]);
      }
      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  setRelasiForKarir: async (karirId: number, jurusanIds: number[]): Promise<boolean> => {
    const pool = await ensureMySQLInitialized();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query('DELETE FROM `jurusan_karir` WHERE `id_karir` = ?', [karirId]);
      for (const jId of Array.from(new Set(jurusanIds.map(Number).filter(Boolean)))) {
        await conn.query('INSERT INTO `jurusan_karir` (`id_jurusan`, `id_karir`) VALUES (?, ?)', [jId, karirId]);
      }
      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // NILAI SISWA & REKOMENDASI
  getNilaiSiswa: async (siswaId: number): Promise<NilaiSiswa[]> => {
    const pool = await ensureMySQLInitialized();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM `nilai_siswa` WHERE `id_user` = ? ORDER BY `id_mata_pelajaran` ASC',
      [siswaId]
    );
    return rows.map(mapNilaiRow);
  },

  saveNilaiSiswaAndCalculate: async (
    siswaId: number,
    inputNilai: { id_mapel: number; nilai: number }[]
  ) => {
    const pool = await ensureMySQLInitialized();
    const [allJurusan, allAturanBobot, allMapel] = await Promise.all([
      db.getJurusan(),
      db.getAturanBobot(),
      db.getMapel(),
    ]);

    const normalizedInput = inputNilai.map(item => ({
      id_mapel: Number(item.id_mapel),
      nilai: Math.min(100, Math.max(0, Number(item.nilai) || 0)),
    }));

    const calculation = calculateJurusanRecommendations(
      normalizedInput,
      allJurusan,
      allAturanBobot,
      allMapel
    );

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query('DELETE FROM `nilai_siswa` WHERE `id_user` = ?', [siswaId]);
      for (const item of normalizedInput) {
        await conn.query(
          'INSERT INTO `nilai_siswa` (`id_user`, `id_mata_pelajaran`, `nilai`) VALUES (?, ?, ?)',
          [siswaId, item.id_mapel, item.nilai]
        );
      }

      await conn.query('DELETE FROM `hasil_rekomendasi` WHERE `id_user` = ?', [siswaId]);
      for (const res of calculation.results) {
        await conn.query(
          'INSERT INTO `hasil_rekomendasi` (`id_user`, `id_jurusan`, `total_skor`, `persentase_kecocokan`, `ranking`) VALUES (?, ?, ?, ?, ?)',
          [siswaId, res.jurusan.id_jurusan, res.rawScore, res.normalizedScore, res.ranking]
        );
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    return calculation;
  },

  getHasilRekomendasiSiswa: async (siswaId: number) => {
    const [siswaNilai, allJurusan, allAturanBobot, allMapel] = await Promise.all([
      db.getNilaiSiswa(siswaId),
      db.getJurusan(),
      db.getAturanBobot(),
      db.getMapel(),
    ]);

    if (siswaNilai.length === 0) {
      return null;
    }

    return calculateJurusanRecommendations(
      siswaNilai.map(n => ({ id_mapel: n.id_mapel, nilai: n.nilai })),
      allJurusan,
      allAturanBobot,
      allMapel
    );
  },

  // STATS & MONITORING FOR GURU BK
  getMonitoringSummary: async () => {
    const pool = await ensureMySQLInitialized();
    const [users, allJurusan, allKarir, nilaiRows, rekomRows] = await Promise.all([
      db.getUsers(),
      db.getJurusan(),
      db.getKarir(),
      pool.query<RowDataPacket[]>('SELECT * FROM `nilai_siswa`').then(([r]) => r.map(mapNilaiRow)),
      pool.query<RowDataPacket[]>('SELECT * FROM `hasil_rekomendasi`').then(([r]) => r.map(mapHasilRekomendasiRow)),
    ]);

    const siswaUsers = users.filter(u => u.role === 'SISWA');

    const siswaStatusList = siswaUsers.map(siswa => {
      const nilai = nilaiRows.filter(n => n.id_siswa === siswa.id);
      const isCompleted = nilai.length >= 8;
      const recs = rekomRows
        .filter(h => h.id_siswa === siswa.id)
        .sort((a, b) => a.ranking - b.ranking);

      const topMajorId = recs[0]?.id_jurusan;
      const topMajor = allJurusan.find(j => j.id_jurusan === topMajorId);

      return {
        siswa,
        totalMapelDiisi: nilai.length,
        status: isCompleted ? 'Selesai Pemetaan' : 'Belum Lengkap',
        topRekomendasi: topMajor
          ? {
              nama: topMajor.nama_jurusan,
              rumpun: topMajor.rumpun,
              skor: recs[0]?.persentase_kecocokan || 0,
            }
          : null,
        tanggal: recs[0]?.tanggal_analisis || null,
      };
    });

    const countPerJurusan: { [key: string]: { count: number; nama: string; rumpun: string } } = {};
    rekomRows
      .filter(h => h.ranking === 1)
      .forEach(h => {
        const jur = allJurusan.find(j => j.id_jurusan === h.id_jurusan);
        if (jur) {
          if (!countPerJurusan[jur.id_jurusan]) {
            countPerJurusan[jur.id_jurusan] = {
              count: 0,
              nama: jur.nama_jurusan,
              rumpun: jur.rumpun,
            };
          }
          countPerJurusan[jur.id_jurusan].count++;
        }
      });

    const topMajors = Object.values(countPerJurusan).sort((a, b) => b.count - a.count);

    return {
      totalSiswa: siswaUsers.length,
      siswaSelesai: siswaStatusList.filter(s => s.status === 'Selesai Pemetaan').length,
      totalJurusan: allJurusan.length,
      totalKarir: allKarir.length,
      topMajors,
      siswaList: siswaStatusList,
    };
  },
};
