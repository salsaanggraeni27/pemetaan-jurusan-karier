import { Jurusan, Karir, RelasiJurusanKarir } from './seed-data';

export interface CareerLinkedProfile {
  jurusan: Jurusan;
  karirList: Karir[];
  relevansiPersen: number;
  highlightIndustri: string[];
}

/**
 * Career Linker Service
 * Menghubungkan program studi dengan profil karir nyata di dunia industri
 */
export function getLinkedCareersForJurusan(
  jurusanId: number,
  allJurusan: Jurusan[],
  allKarir: Karir[],
  allRelasi: RelasiJurusanKarir[]
): CareerLinkedProfile | null {
  const jurusan = allJurusan.find(j => j.id_jurusan === jurusanId);
  if (!jurusan) return null;

  const relevantRelasi = allRelasi.filter(r => r.id_jurusan === jurusanId);
  const relevantKarirIds = new Set(relevantRelasi.map(r => r.id_karir));

  const karirList = allKarir.filter(k => relevantKarirIds.has(k.id_karir));

  const industriSet = new Set<string>();
  karirList.forEach(k => {
    k.industri.split(',').forEach(item => industriSet.add(item.trim()));
  });

  return {
    jurusan,
    karirList,
    relevansiPersen: 98,
    highlightIndustri: Array.from(industriSet)
  };
}

export function getAllCareerProfilesWithRelations(
  allJurusan: Jurusan[],
  allKarir: Karir[],
  allRelasi: RelasiJurusanKarir[]
): { karir: Karir; jurusanTerkait: Jurusan[] }[] {
  return allKarir.map(karir => {
    const relasi = allRelasi.filter(r => r.id_karir === karir.id_karir);
    const jurusanIds = new Set(relasi.map(r => r.id_jurusan));
    const jurusanTerkait = allJurusan.filter(j => jurusanIds.has(j.id_jurusan));

    return {
      karir,
      jurusanTerkait
    };
  });
}

