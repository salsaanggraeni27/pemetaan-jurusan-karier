import mysql, { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import {
  initialUsers,
  initialMataPelajaran,
  initialJurusan,
  initialAturanBobot,
  initialKarir,
  initialRelasiJurusanKarir,
  initialNilaiSiswa
} from './seed-data';
import { calculateJurusanRecommendations } from './rule-engine';

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = Number(process.env.MYSQL_PORT) || 3306;
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD ?? '';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'sman1_mapping_jurusan';

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __mysqlInitPromise: Promise<void> | undefined;
}

export function getPool(): Pool {
  if (!global.__mysqlPool) {
    global.__mysqlPool = mysql.createPool({
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return global.__mysqlPool;
}

/**
 * Ensures the database and uniform tables exist and are seeded if empty.
 */
export async function ensureMySQLInitialized(): Promise<Pool> {
  if (!global.__mysqlInitPromise) {
    global.__mysqlInitPromise = initializeSchemaIfNeeded().catch(err => {
      global.__mysqlInitPromise = undefined;
      throw err;
    });
  }
  await global.__mysqlInitPromise;
  return getPool();
}

async function initializeSchemaIfNeeded(): Promise<void> {
  // 1. Ensure database exists using a bootstrap connection without database selected
  const bootstrap = await mysql.createConnection({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
  });
  try {
    await bootstrap.query(
      `CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await bootstrap.end();
  }

  const pool = getPool();

  // Check if uniform schema is already in place (check if `jurusan_karir` table exists)
  const [tables] = await pool.query<RowDataPacket[]>(
    `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'jurusan_karir'`,
    [MYSQL_DATABASE]
  );

  if (tables.length === 0) {
    // Recreate tables with the uniform schema
    const conn = await pool.getConnection();
    try {
      await conn.query('SET FOREIGN_KEY_CHECKS = 0');
      await conn.query('DROP TABLE IF EXISTS `hasil_rekomendasi`');
      await conn.query('DROP TABLE IF EXISTS `nilai_siswa`');
      await conn.query('DROP TABLE IF EXISTS `jurusan_karir`');
      await conn.query('DROP TABLE IF EXISTS `relasi_jurusan_karir`');
      await conn.query('DROP TABLE IF EXISTS `aturan_bobot`');
      await conn.query('DROP TABLE IF EXISTS `karir`');
      await conn.query('DROP TABLE IF EXISTS `jurusan`');
      await conn.query('DROP TABLE IF EXISTS `mata_pelajaran`');
      await conn.query('DROP TABLE IF EXISTS `users`');
      await conn.query('SET FOREIGN_KEY_CHECKS = 1');

      await conn.query(`
        CREATE TABLE \`users\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`nisn_nip\` VARCHAR(50) NOT NULL,
          \`nama\` VARCHAR(150) NOT NULL,
          \`role\` ENUM('SISWA', 'GURU_BK') NOT NULL DEFAULT 'SISWA',
          \`kelas\` VARCHAR(50) NULL,
          \`email\` VARCHAR(100) NULL,
          \`password\` VARCHAR(255) NOT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT \`uq_users_nisn_nip\` UNIQUE (\`nisn_nip\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      await conn.query(`
        CREATE TABLE \`mata_pelajaran\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`nama_mapel\` VARCHAR(100) NOT NULL,
          \`kategori\` ENUM('Wajib', 'Peminatan MIPA', 'Peminatan IPS', 'Peminatan Bahasa') NOT NULL,
          \`deskripsi\` TEXT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      await conn.query(`
        CREATE TABLE \`jurusan\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`nama_jurusan\` VARCHAR(150) NOT NULL,
          \`rumpun\` ENUM('Saintek', 'Soshum', 'Campuran') NOT NULL,
          \`fakultas\` VARCHAR(150) NOT NULL,
          \`deskripsi\` TEXT NOT NULL,
          \`daya_tampung\` INT NOT NULL DEFAULT 50,
          \`passing_grade_indikatif\` DECIMAL(5,2) NOT NULL DEFAULT 80.00,
          \`universitas_favorit\` TEXT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      await conn.query(`
        CREATE TABLE \`aturan_bobot\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`id_jurusan\` INT NOT NULL,
          \`id_mata_pelajaran\` INT NOT NULL,
          \`bobot\` DECIMAL(5,2) NOT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT \`uq_aturan_bobot_jurusan_mapel\` UNIQUE (\`id_jurusan\`, \`id_mata_pelajaran\`),
          CONSTRAINT \`fk_aturan_bobot_jurusan\` FOREIGN KEY (\`id_jurusan\`) REFERENCES \`jurusan\`(\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_aturan_bobot_mata_pelajaran\` FOREIGN KEY (\`id_mata_pelajaran\`) REFERENCES \`mata_pelajaran\`(\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      await conn.query(`
        CREATE TABLE \`karir\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`profesi\` VARCHAR(150) NOT NULL,
          \`deskripsi\` TEXT NOT NULL,
          \`industri\` VARCHAR(150) NOT NULL,
          \`estimasi_gaji\` VARCHAR(100) NOT NULL,
          \`kualifikasi_utama\` TEXT NOT NULL,
          \`prospek_masa_depan\` ENUM('Sangat Tinggi', 'Tinggi', 'Stabil') NOT NULL DEFAULT 'Tinggi',
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      await conn.query(`
        CREATE TABLE \`jurusan_karir\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`id_jurusan\` INT NOT NULL,
          \`id_karir\` INT NOT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT \`uq_jurusan_karir\` UNIQUE (\`id_jurusan\`, \`id_karir\`),
          CONSTRAINT \`fk_jurusan_karir_jurusan\` FOREIGN KEY (\`id_jurusan\`) REFERENCES \`jurusan\`(\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_jurusan_karir_karir\` FOREIGN KEY (\`id_karir\`) REFERENCES \`karir\`(\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      await conn.query(`
        CREATE TABLE \`nilai_siswa\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`id_user\` INT NOT NULL,
          \`id_mata_pelajaran\` INT NOT NULL,
          \`nilai\` DECIMAL(5,2) NOT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT \`uq_nilai_siswa_user_mapel\` UNIQUE (\`id_user\`, \`id_mata_pelajaran\`),
          CONSTRAINT \`fk_nilai_siswa_user\` FOREIGN KEY (\`id_user\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_nilai_siswa_mata_pelajaran\` FOREIGN KEY (\`id_mata_pelajaran\`) REFERENCES \`mata_pelajaran\`(\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      await conn.query(`
        CREATE TABLE \`hasil_rekomendasi\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`id_user\` INT NOT NULL,
          \`id_jurusan\` INT NOT NULL,
          \`total_skor\` DECIMAL(7,2) NOT NULL,
          \`persentase_kecocokan\` DECIMAL(5,2) NOT NULL,
          \`ranking\` INT NOT NULL,
          \`tanggal_analisis\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT \`fk_hasil_rekomendasi_user\` FOREIGN KEY (\`id_user\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_hasil_rekomendasi_jurusan\` FOREIGN KEY (\`id_jurusan\`) REFERENCES \`jurusan\`(\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
    } finally {
      conn.release();
    }
  }

  // Seed initial data if `users` table is empty
  const [userCountRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS cnt FROM `users`');
  if (Number(userCountRows[0]?.cnt || 0) === 0) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      for (const u of initialUsers) {
        await conn.query(
          'INSERT INTO `users` (`id`, `nisn_nip`, `nama`, `role`, `kelas`, `email`, `password`) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [u.id, u.nisn_nip, u.nama, u.role, u.kelas || null, u.email || null, u.password || 'password123']
        );
      }

      for (const m of initialMataPelajaran) {
        await conn.query(
          'INSERT INTO `mata_pelajaran` (`id`, `nama_mapel`, `kategori`, `deskripsi`) VALUES (?, ?, ?, ?)',
          [m.id_mapel, m.nama_mapel, m.kategori, m.deskripsi || null]
        );
      }

      for (const j of initialJurusan) {
        await conn.query(
          'INSERT INTO `jurusan` (`id`, `nama_jurusan`, `rumpun`, `fakultas`, `deskripsi`, `daya_tampung`, `passing_grade_indikatif`, `universitas_favorit`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            j.id_jurusan,
            j.nama_jurusan,
            j.rumpun,
            j.fakultas,
            j.deskripsi,
            j.daya_tampung,
            j.passing_grade_indikatif,
            JSON.stringify(j.universitas_favorit || [])
          ]
        );
      }

      for (const r of initialAturanBobot) {
        await conn.query(
          'INSERT INTO `aturan_bobot` (`id`, `id_jurusan`, `id_mata_pelajaran`, `bobot`) VALUES (?, ?, ?, ?)',
          [r.id_rule, r.id_jurusan, r.id_mapel, r.bobot]
        );
      }

      for (const k of initialKarir) {
        await conn.query(
          'INSERT INTO `karir` (`id`, `profesi`, `deskripsi`, `industri`, `estimasi_gaji`, `kualifikasi_utama`, `prospek_masa_depan`) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            k.id_karir,
            k.profesi,
            k.deskripsi,
            k.industri,
            k.estimasi_gaji,
            JSON.stringify(k.kualifikasi_utama || []),
            k.prospek_masa_depan
          ]
        );
      }

      for (const rel of initialRelasiJurusanKarir) {
        await conn.query(
          'INSERT INTO `jurusan_karir` (`id`, `id_jurusan`, `id_karir`) VALUES (?, ?, ?)',
          [rel.id, rel.id_jurusan, rel.id_karir]
        );
      }

      for (const n of initialNilaiSiswa) {
        await conn.query(
          'INSERT INTO `nilai_siswa` (`id`, `id_user`, `id_mata_pelajaran`, `nilai`) VALUES (?, ?, ?, ?)',
          [n.id_nilai, n.id_siswa, n.id_mapel, n.nilai]
        );
      }

      // Compute and insert initial recommendations for seeded students
      const seededSiswaIds = Array.from(new Set(initialNilaiSiswa.map(n => n.id_siswa)));
      for (const siswaId of seededSiswaIds) {
        const nilaiSiswa = initialNilaiSiswa.filter(n => n.id_siswa === siswaId);
        if (nilaiSiswa.length > 0) {
          const rec = calculateJurusanRecommendations(
            nilaiSiswa.map(n => ({ id_mapel: n.id_mapel, nilai: n.nilai })),
            initialJurusan,
            initialAturanBobot,
            initialMataPelajaran
          );
          for (const r of rec.results) {
            await conn.query(
              'INSERT INTO `hasil_rekomendasi` (`id_user`, `id_jurusan`, `total_skor`, `persentase_kecocokan`, `ranking`) VALUES (?, ?, ?, ?, ?)',
              [siswaId, r.jurusan.id_jurusan, r.rawScore, r.normalizedScore, r.ranking]
            );
          }
        }
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}

export type { RowDataPacket, ResultSetHeader };
