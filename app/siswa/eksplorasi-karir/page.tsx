'use client';

import React, { useState, useEffect } from 'react';
import { Search, Briefcase } from 'lucide-react';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';
import { PillTabs } from '@/components/ui/pill-tabs';

export default function EksplorasiKarirPage() {
  const [karirList, setKarirList] = useState<any[]>([]);
  const [jurusanList, setJurusanList] = useState<any[]>([]);
  const [relasiList, setRelasiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProspek, setSelectedProspek] = useState('Semua');

  useEffect(() => {
    Promise.all([
      fetch('/api/karir').then((res) => res.json()),
      fetch('/api/jurusan').then((res) => res.json()),
    ])
      .then(([karirRes, jurRes]) => {
        if (karirRes.success) {
          setKarirList(karirRes.data || []);
          setRelasiList(karirRes.relasi || []);
        }
        if (jurRes.success) {
          setJurusanList(jurRes.data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredKarir = karirList.filter((k) => {
    const matchSearch =
      k.profesi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.industri.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProspek =
      selectedProspek === 'Semua' || k.prospek_masa_depan === selectedProspek;
    return matchSearch && matchProspek;
  });

  const getJurusanForKarir = (karirId: number) => {
    const matchedRelasi = relasiList.filter((r) => r.id_karir === karirId);
    const jurIds = new Set(matchedRelasi.map((r) => r.id_jurusan));
    return jurusanList.filter((j) => jurIds.has(j.id_jurusan));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-[#6e6e6e] text-sm">
        Memuat katalog prospek karir dan profesi...
      </div>
    );
  }

  const prospekTabs = [
    { id: 'Semua', label: 'Semua' },
    { id: 'Sangat Tinggi', label: 'Sangat Tinggi' },
    { id: 'Tinggi', label: 'Tinggi' },
    { id: 'Stabil', label: 'Stabil' },
  ];

  const bentoItems: BentoItem[] = filteredKarir.map((karir) => {
    const relatedMajors = getJurusanForKarir(karir.id_karir);
    const skills = Array.isArray(karir.kualifikasi_utama)
      ? karir.kualifikasi_utama.slice(0, 3)
      : [karir.kualifikasi_utama];

    return {
      title: karir.profesi,
      meta: karir.industri,
      status: karir.estimasi_gaji,
      description: karir.deskripsi,
      icon: <Briefcase className="w-4 h-4 text-[#2f4b79]" />,
      tags: skills,
      cta: relatedMajors[0]?.nama_jurusan
        ? `Jurusan: ${relatedMajors[0].nama_jurusan}`
        : `Prospek ${karir.prospek_masa_depan}`,
      href: '/siswa/rekomendasi',
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#6e6e6e]">
            Career Linker Service · SMAN 1 Bandung
          </span>
          <h1 className="text-2xl font-bold text-[#333333] tracking-tight">
            Katalog Prospek Karir
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#6e6e6e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari profesi atau industri..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg bg-white border border-[#cccccc] text-[#333333]"
            />
          </div>
          <PillTabs
            tabs={prospekTabs}
            activeTab={selectedProspek}
            onChange={setSelectedProspek}
          />
        </div>
      </div>

      <BentoGrid items={bentoItems} />
    </div>
  );
}
