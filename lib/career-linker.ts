import { Jurusan, Karir, JurusanKarir } from '@/types';

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
  allJurusan: (Jurusan | any)[],
  allKarir: (Karir | any)[],
  allRelasi: JurusanKarir[]
): CareerLinkedProfile | null {
  const jurusan = allJurusan.find(j => Number(j.id ?? j.id_jurusan) === Number(jurusanId));
  if (!jurusan) return null;

  const relevantRelasi = allRelasi.filter(r => Number(r.id_jurusan) === Number(jurusanId));
  const relevantKarirIds = new Set(relevantRelasi.map(r => Number(r.id_karir)));

  const karirList = allKarir.filter(k => relevantKarirIds.has(Number(k.id ?? k.id_karir)));

  const industriSet = new Set<string>();
  karirList.forEach(k => {
    k.industri.split(',').forEach((item: string) => industriSet.add(item.trim()));
  });

  return {
    jurusan,
    karirList,
    relevansiPersen: 98,
    highlightIndustri: Array.from(industriSet)
  };
}

export function getAllCareerProfilesWithRelations(
  allJurusan: (Jurusan | any)[],
  allKarir: (Karir | any)[],
  allRelasi: JurusanKarir[]
): { karir: Karir; jurusanTerkait: Jurusan[] }[] {
  return allKarir.map(karir => {
    const karirId = Number(karir.id ?? karir.id_karir);
    const relasi = allRelasi.filter(r => Number(r.id_karir) === karirId);
    const jurusanIds = new Set(relasi.map(r => Number(r.id_jurusan)));
    const jurusanTerkait = allJurusan.filter(j => jurusanIds.has(Number(j.id ?? j.id_jurusan)));

    return {
      karir,
      jurusanTerkait
    };
  });
}

