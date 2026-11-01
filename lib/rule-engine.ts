import { Jurusan, AturanBobot, NilaiSiswa, MataPelajaran } from './seed-data';

export interface JurusanScoreResult {
  jurusan: Jurusan;
  ranking: number;
  rawScore: number;
  totalWeight: number;
  normalizedScore: number; // 0 - 100%
  breakdown: {
    mapelId: number;
    namaMapel: string;
    nilaiSiswa: number;
    bobot: number;
    kontribusiSkor: number;
  }[];
  peluangStatus: 'Sangat Berpeluang' | 'Berpeluang Kompetitif' | 'Perlu Peningkatan';
  selisihPassingGrade: number;
}

export interface RecommendationEngineOutput {
  results: JurusanScoreResult[];
  kekuatanAkademik: {
    terkuat: { namaMapel: string; nilai: number }[];
    perluDitingkatkan: { namaMapel: string; nilai: number }[];
  };
  rataRataNilaiKeseluruhan: number;
  totalMapelDinilai: number;
}

/**
 * Rule-Based Matching Engine
 * Formula:
 * Skor_jurusan(J) = sum(Nilai_mapel_i * Bobot_mapel_i,j) / sum(Bobot_mapel_i,j)
 */
export function calculateJurusanRecommendations(
  nilaiSiswaList: { id_mapel: number; nilai: number }[],
  allJurusan: Jurusan[],
  allAturanBobot: AturanBobot[],
  allMapel: MataPelajaran[]
): RecommendationEngineOutput {
  const mapelMap = new Map<number, MataPelajaran>();
  allMapel.forEach(m => mapelMap.set(m.id_mapel, m));

  const nilaiMap = new Map<number, number>();
  let totalNilai = 0;
  nilaiSiswaList.forEach(n => {
    // Pastikan nilai berada di range 0-100
    const normalized = Math.min(100, Math.max(0, Number(n.nilai) || 0));
    nilaiMap.set(n.id_mapel, normalized);
    totalNilai += normalized;
  });

  const totalMapelDinilai = nilaiSiswaList.length;
  const rataRataNilaiKeseluruhan = totalMapelDinilai > 0 
    ? parseFloat((totalNilai / totalMapelDinilai).toFixed(1)) 
    : 0;

  // Hitung skor untuk setiap jurusan berdasarkan aturan pembobotan
  const scoredJurusan = allJurusan.map(jurusan => {
    const rules = allAturanBobot.filter(r => r.id_jurusan === jurusan.id_jurusan);

    let rawScore = 0;
    let totalWeight = 0;
    const breakdown: JurusanScoreResult['breakdown'] = [];

    if (rules.length > 0) {
      rules.forEach(rule => {
        const nilai = nilaiMap.get(rule.id_mapel) ?? 0;
        const bobot = rule.bobot;
        const kontribusi = (nilai * bobot) / 100;

        rawScore += (nilai * bobot);
        totalWeight += bobot;

        const mapel = mapelMap.get(rule.id_mapel);
        breakdown.push({
          mapelId: rule.id_mapel,
          namaMapel: mapel ? mapel.nama_mapel : `Mapel #${rule.id_mapel}`,
          nilaiSiswa: nilai,
          bobot: bobot,
          kontribusiSkor: parseFloat(kontribusi.toFixed(2))
        });
      });
    }

    // Normalisasi: jika total bobot bukan 100, bagi dengan total bobot
    const normalizedScore = totalWeight > 0 
      ? parseFloat((rawScore / totalWeight).toFixed(2)) 
      : 0;

    const selisihPassingGrade = parseFloat((normalizedScore - (jurusan.passing_grade_indikatif || 80)).toFixed(2));

    let peluangStatus: JurusanScoreResult['peluangStatus'] = 'Perlu Peningkatan';
    if (selisihPassingGrade >= 2.0) {
      peluangStatus = 'Sangat Berpeluang';
    } else if (selisihPassingGrade >= -3.0) {
      peluangStatus = 'Berpeluang Kompetitif';
    } else {
      peluangStatus = 'Perlu Peningkatan';
    }

    return {
      jurusan,
      ranking: 0,
      rawScore: parseFloat(rawScore.toFixed(2)),
      totalWeight,
      normalizedScore,
      breakdown,
      peluangStatus,
      selisihPassingGrade
    };
  });

  // Urutkan berdasarkan normalizedScore tertinggi (Rule-Based Matching Ranking)
  scoredJurusan.sort((a, b) => b.normalizedScore - a.normalizedScore);

  // Berikan nomor ranking
  const results: JurusanScoreResult[] = scoredJurusan.map((item, idx) => ({
    ...item,
    ranking: idx + 1
  }));

  // Analisis kekuatan akademik siswa
  const sortedNilai = [...nilaiSiswaList]
    .map(n => ({
      namaMapel: mapelMap.get(n.id_mapel)?.nama_mapel || `Mapel ${n.id_mapel}`,
      nilai: n.nilai
    }))
    .sort((a, b) => b.nilai - a.nilai);

  const terkuat = sortedNilai.slice(0, 3);
  const perluDitingkatkan = [...sortedNilai].reverse().slice(0, 3);

  return {
    results,
    kekuatanAkademik: {
      terkuat,
      perluDitingkatkan
    },
    rataRataNilaiKeseluruhan,
    totalMapelDinilai
  };
}

