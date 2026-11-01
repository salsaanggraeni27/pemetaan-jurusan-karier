import fs from 'fs';
import path from 'path';
import {
  MataPelajaran,
  Jurusan,
  AturanBobot,
  Karir,
  RelasiJurusanKarir,
  User,
  NilaiSiswa,
  HasilRekomendasi,
  initialMataPelajaran,
  initialJurusan,
  initialAturanBobot,
  initialKarir,
  initialRelasiJurusanKarir,
  initialUsers,
  initialNilaiSiswa
} from './seed-data';
import { calculateJurusanRecommendations } from './rule-engine';

interface AppDatabaseData {
  mata_pelajaran: MataPelajaran[];
  jurusan: Jurusan[];
  aturan_bobot: AturanBobot[];
  karir: Karir[];
  relasi_jurusan_karir: RelasiJurusanKarir[];
  users: User[];
  nilai_siswa: NilaiSiswa[];
  hasil_rekomendasi: HasilRekomendasi[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'sman1_data.json');

let memoryDb: AppDatabaseData | null = null;

function ensureDataFile(): AppDatabaseData {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      memoryDb = JSON.parse(raw);
      return memoryDb!;
    }
  } catch (err) {
    console.warn('Error reading json db, initializing fresh seed:', err);
  }

  // Generate initial recommendations for seeded students
  const seededHasil: HasilRekomendasi[] = [];
  [1, 2, 3].forEach(siswaId => {
    const nilaiSiswa = initialNilaiSiswa.filter(n => n.id_siswa === siswaId);
    if (nilaiSiswa.length > 0) {
      const rec = calculateJurusanRecommendations(
        nilaiSiswa.map(n => ({ id_mapel: n.id_mapel, nilai: n.nilai })),
        initialJurusan,
        initialAturanBobot,
        initialMataPelajaran
      );
      rec.results.slice(0, 3).forEach((r, idx) => {
        seededHasil.push({
          id: seededHasil.length + 1,
          id_siswa: siswaId,
          id_jurusan: r.jurusan.id_jurusan,
          total_skor: r.rawScore,
          persentase_kecocokan: r.normalizedScore,
          ranking: idx + 1,
          tanggal_analisis: new Date().toISOString()
        });
      });
    }
  });

  const initialData: AppDatabaseData = {
    mata_pelajaran: initialMataPelajaran,
    jurusan: initialJurusan,
    aturan_bobot: initialAturanBobot,
    karir: initialKarir,
    relasi_jurusan_karir: initialRelasiJurusanKarir,
    users: initialUsers,
    nilai_siswa: initialNilaiSiswa,
    hasil_rekomendasi: seededHasil,
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Could not write initial data file:', err);
  }

  memoryDb = initialData;
  return memoryDb;
}

function persistData() {
  if (!memoryDb) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

export const db = {
  // USERS
  getUsers: () => ensureDataFile().users,
  getUserById: (id: number) => ensureDataFile().users.find(u => u.id === id),
  getUserByNisnNip: (nisn_nip: string) => ensureDataFile().users.find(u => u.nisn_nip.toLowerCase() === nisn_nip.trim().toLowerCase()),
  createUser: (user: Omit<User, 'id'>) => {
    const data = ensureDataFile();
    const newId = (data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) : 0) + 1;
    const newUser: User = { ...user, id: newId };
    data.users.push(newUser);
    persistData();
    return newUser;
  },

  // MATA PELAJARAN
  getMapel: () => ensureDataFile().mata_pelajaran,
  getMapelById: (id: number) => ensureDataFile().mata_pelajaran.find(m => m.id_mapel === id),
  saveMapel: (mapel: MataPelajaran) => {
    const data = ensureDataFile();
    const idx = data.mata_pelajaran.findIndex(m => m.id_mapel === mapel.id_mapel);
    if (idx >= 0) {
      data.mata_pelajaran[idx] = mapel;
    } else {
      const newId = (data.mata_pelajaran.length > 0 ? Math.max(...data.mata_pelajaran.map(m => m.id_mapel)) : 0) + 1;
      mapel.id_mapel = newId;
      data.mata_pelajaran.push(mapel);
    }
    persistData();
    return mapel;
  },
  deleteMapel: (id: number) => {
    const data = ensureDataFile();
    data.mata_pelajaran = data.mata_pelajaran.filter(m => m.id_mapel !== id);
    data.aturan_bobot = data.aturan_bobot.filter(r => r.id_mapel !== id);
    data.nilai_siswa = data.nilai_siswa.filter(n => n.id_mapel !== id);
    persistData();
    return true;
  },

  // JURUSAN
  getJurusan: () => ensureDataFile().jurusan,
  getJurusanById: (id: number) => ensureDataFile().jurusan.find(j => j.id_jurusan === id),
  saveJurusan: (jurusan: Jurusan) => {
    const data = ensureDataFile();
    const idx = data.jurusan.findIndex(j => j.id_jurusan === jurusan.id_jurusan);
    if (idx >= 0) {
      data.jurusan[idx] = jurusan;
    } else {
      const newId = (data.jurusan.length > 0 ? Math.max(...data.jurusan.map(j => j.id_jurusan)) : 0) + 1;
      jurusan.id_jurusan = newId;
      data.jurusan.push(jurusan);
    }
    persistData();
    return jurusan;
  },
  deleteJurusan: (id: number) => {
    const data = ensureDataFile();
    data.jurusan = data.jurusan.filter(j => j.id_jurusan !== id);
    data.aturan_bobot = data.aturan_bobot.filter(r => r.id_jurusan !== id);
    data.relasi_jurusan_karir = data.relasi_jurusan_karir.filter(r => r.id_jurusan !== id);
    data.hasil_rekomendasi = data.hasil_rekomendasi.filter(h => h.id_jurusan !== id);
    persistData();
    return true;
  },

  // ATURAN BOBOT
  getAturanBobot: () => ensureDataFile().aturan_bobot,
  getAturanBobotByJurusan: (jurusanId: number) => ensureDataFile().aturan_bobot.filter(r => r.id_jurusan === jurusanId),
  updateAturanBobotForJurusan: (jurusanId: number, rules: { id_mapel: number; bobot: number }[]) => {
    const data = ensureDataFile();
    // Hapus rules lama untuk jurusan ini
    data.aturan_bobot = data.aturan_bobot.filter(r => r.id_jurusan !== jurusanId);
    let nextId = (data.aturan_bobot.length > 0 ? Math.max(...data.aturan_bobot.map(r => r.id_rule)) : 0) + 1;
    rules.forEach(rule => {
      data.aturan_bobot.push({
        id_rule: nextId++,
        id_jurusan: jurusanId,
        id_mapel: rule.id_mapel,
        bobot: rule.bobot
      });
    });
    persistData();
    return data.aturan_bobot.filter(r => r.id_jurusan === jurusanId);
  },

  // KARIR
  getKarir: () => ensureDataFile().karir,
  getKarirById: (id: number) => ensureDataFile().karir.find(k => k.id_karir === id),
  saveKarir: (karir: Karir) => {
    const data = ensureDataFile();
    const idx = data.karir.findIndex(k => k.id_karir === karir.id_karir);
    if (idx >= 0) {
      data.karir[idx] = karir;
    } else {
      const newId = (data.karir.length > 0 ? Math.max(...data.karir.map(k => k.id_karir)) : 0) + 1;
      karir.id_karir = newId;
      data.karir.push(karir);
    }
    persistData();
    return karir;
  },
  deleteKarir: (id: number) => {
    const data = ensureDataFile();
    data.karir = data.karir.filter(k => k.id_karir !== id);
    data.relasi_jurusan_karir = data.relasi_jurusan_karir.filter(r => r.id_karir !== id);
    persistData();
    return true;
  },

  // RELASI JURUSAN KARIR
  getRelasiJurusanKarir: () => ensureDataFile().relasi_jurusan_karir,
  setRelasiForJurusan: (jurusanId: number, karirIds: number[]) => {
    const data = ensureDataFile();
    data.relasi_jurusan_karir = data.relasi_jurusan_karir.filter(r => r.id_jurusan !== jurusanId);
    let nextId = (data.relasi_jurusan_karir.length > 0 ? Math.max(...data.relasi_jurusan_karir.map(r => r.id)) : 0) + 1;
    karirIds.forEach(kId => {
      data.relasi_jurusan_karir.push({
        id: nextId++,
        id_jurusan: jurusanId,
        id_karir: kId
      });
    });
    persistData();
    return true;
  },

  // NILAI SISWA & REKOMENDASI
  getNilaiSiswa: (siswaId: number) => {
    const data = ensureDataFile();
    return data.nilai_siswa.filter(n => n.id_siswa === siswaId);
  },
  saveNilaiSiswaAndCalculate: (siswaId: number, inputNilai: { id_mapel: number; nilai: number }[]) => {
    const data = ensureDataFile();
    
    // Hapus nilai lama siswa ini
    data.nilai_siswa = data.nilai_siswa.filter(n => n.id_siswa !== siswaId);
    let nextId = (data.nilai_siswa.length > 0 ? Math.max(...data.nilai_siswa.map(n => n.id_nilai)) : 0) + 1;
    
    inputNilai.forEach(item => {
      data.nilai_siswa.push({
        id_nilai: nextId++,
        id_siswa: siswaId,
        id_mapel: item.id_mapel,
        nilai: Math.min(100, Math.max(0, Number(item.nilai) || 0))
      });
    });

    // Jalankan Rule-Based Matching Engine
    const calculation = calculateJurusanRecommendations(
      inputNilai,
      data.jurusan,
      data.aturan_bobot,
      data.mata_pelajaran
    );

    // Simpan hasil rekomendasi ke database
    data.hasil_rekomendasi = data.hasil_rekomendasi.filter(h => h.id_siswa !== siswaId);
    let nextRecId = (data.hasil_rekomendasi.length > 0 ? Math.max(...data.hasil_rekomendasi.map(h => h.id)) : 0) + 1;
    
    calculation.results.forEach(res => {
      data.hasil_rekomendasi.push({
        id: nextRecId++,
        id_siswa: siswaId,
        id_jurusan: res.jurusan.id_jurusan,
        total_skor: res.rawScore,
        persentase_kecocokan: res.normalizedScore,
        ranking: res.ranking,
        tanggal_analisis: new Date().toISOString()
      });
    });

    persistData();
    return calculation;
  },
  getHasilRekomendasiSiswa: (siswaId: number) => {
    const data = ensureDataFile();
    const siswaNilai = data.nilai_siswa.filter(n => n.id_siswa === siswaId);
    if (siswaNilai.length === 0) {
      return null;
    }
    return calculateJurusanRecommendations(
      siswaNilai.map(n => ({ id_mapel: n.id_mapel, nilai: n.nilai })),
      data.jurusan,
      data.aturan_bobot,
      data.mata_pelajaran
    );
  },

  // STATS & MONITORING FOR GURU BK
  getMonitoringSummary: () => {
    const data = ensureDataFile();
    const siswaUsers = data.users.filter(u => u.role === 'SISWA');
    
    const siswaStatusList = siswaUsers.map(siswa => {
      const nilai = data.nilai_siswa.filter(n => n.id_siswa === siswa.id);
      const isCompleted = nilai.length >= 8; // minimal 8 mapel
      const recs = data.hasil_rekomendasi.filter(h => h.id_siswa === siswa.id).sort((a, b) => a.ranking - b.ranking);
      
      const topMajorId = recs[0]?.id_jurusan;
      const topMajor = data.jurusan.find(j => j.id_jurusan === topMajorId);

      return {
        siswa,
        totalMapelDiisi: nilai.length,
        status: isCompleted ? 'Selesai Pemetaan' : 'Belum Lengkap',
        topRekomendasi: topMajor ? {
          nama: topMajor.nama_jurusan,
          rumpun: topMajor.rumpun,
          skor: recs[0]?.persentase_kecocokan || 0
        } : null,
        tanggal: recs[0]?.tanggal_analisis || null
      };
    });

    // Top recommended majors
    const countPerJurusan: { [key: string]: { count: number; nama: string; rumpun: string } } = {};
    data.hasil_rekomendasi.filter(h => h.ranking === 1).forEach(h => {
      const jur = data.jurusan.find(j => j.id_jurusan === h.id_jurusan);
      if (jur) {
        if (!countPerJurusan[jur.id_jurusan]) {
          countPerJurusan[jur.id_jurusan] = { count: 0, nama: jur.nama_jurusan, rumpun: jur.rumpun };
        }
        countPerJurusan[jur.id_jurusan].count++;
      }
    });

    const topMajors = Object.values(countPerJurusan).sort((a, b) => b.count - a.count);

    return {
      totalSiswa: siswaUsers.length,
      siswaSelesai: siswaStatusList.filter(s => s.status === 'Selesai Pemetaan').length,
      totalJurusan: data.jurusan.length,
      totalKarir: data.karir.length,
      topMajors,
      siswaList: siswaStatusList
    };
  }
};
