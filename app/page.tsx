'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CairnAgentsLanding from '@/components/ui/cairn-agents-landing';
import { PillTabs } from '@/components/ui/pill-tabs';
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Search,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const [jurusanList, setJurusanList] = useState<any[]>([]);
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [aturanList, setAturanList] = useState<any[]>([]);
  const [karirList, setKarirList] = useState<any[]>([]);
  const [relasiList, setRelasiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRumpun, setSelectedRumpun] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/jurusan').then((r) => r.json()),
      fetch('/api/mapel').then((r) => r.json()),
      fetch('/api/aturan-bobot').then((r) => r.json()),
      fetch('/api/karir').then((r) => r.json()),
    ])
      .then(([jurRes, mapelRes, aturanRes, karirRes]) => {
        if (jurRes.success) setJurusanList(jurRes.data || []);
        if (mapelRes.success) setMapelList(mapelRes.data || []);
        if (aturanRes.success) setAturanList(aturanRes.data || []);
        if (karirRes.success) {
          setKarirList(karirRes.data || []);
          setRelasiList(karirRes.relasi || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getMapelForJurusan = (jurusanId: number) => {
    const rules = aturanList
      .filter((r) => r.id_jurusan === jurusanId && r.bobot > 0)
      .sort((a, b) => b.bobot - a.bobot);

    return rules.map((r) => {
      const m = mapelList.find((item) => item.id_mapel === r.id_mapel);
      return {
        id_mapel: r.id_mapel,
        nama_mapel: m ? m.nama_mapel : `Mapel #${r.id_mapel}`,
        bobot: r.bobot,
      };
    });
  };

  const getKarirForJurusan = (jurusanId: number) => {
    const rels = relasiList.filter((r) => r.id_jurusan === jurusanId);
    const karirIds = new Set(rels.map((r) => r.id_karir));
    return karirList.filter((k) => karirIds.has(k.id_karir));
  };

  const filteredJurusan = jurusanList.filter((j) => {
    const matchRumpun =
      selectedRumpun === 'Semua' || j.rumpun === selectedRumpun;
    const q = searchQuery.toLowerCase();
    if (!q) return matchRumpun;

    const mapels = getMapelForJurusan(j.id_jurusan);
    const karirs = getKarirForJurusan(j.id_jurusan);

    const matchText =
      j.nama_jurusan.toLowerCase().includes(q) ||
      j.fakultas.toLowerCase().includes(q) ||
      mapels.some((m) => m.nama_mapel.toLowerCase().includes(q)) ||
      karirs.some((k) => k.profesi.toLowerCase().includes(q));

    return matchRumpun && matchText;
  });

  const rumpunTabs = [
    { id: 'Semua', label: 'Semua Rumpun' },
    { id: 'Saintek', label: 'Saintek' },
    { id: 'Soshum', label: 'Soshum' },
    { id: 'Campuran', label: 'Campuran' },
  ];

  return (
    <CairnAgentsLanding
      brand="SMAN 1 Bandung"
      palette="fog"
      nav={[
        { label: 'Peta Jurusan & Karir', href: '#katalog' },
        { label: 'Evaluasi Nilai Rapor', href: '#evaluasi-siswa' },
      ]}
      login={{ label: 'Masuk Portal', href: '/login' }}
      action={{ label: 'Cek Nilai Rapor', href: '/login' }}
      announcement={{
        label: '12 Program Studi PTN · 14 Mata Pelajaran · 15 Jalur Karir',
        href: '#katalog',
      }}
      title={'Pemetaan Jurusan Kuliah\ndan Prospek Karir Siswa'}
      subtitle="Pelajari mata pelajaran rapor yang mendukung setiap jurusan perguruan tinggi beserta prospek karir lulusannya di SMAN 1 Bandung."
      primaryAction={{
        label: 'Cek Detail Berdasarkan Nilai Rapor',
        href: '/login',
      }}
      heroStage={null}
      scenarios={null}
      liveCalls={null}
      logos={null}
      canvas={null}
      call={null}
      stats={null}
      quotes={null}
      cta={null}
      footer={{
        tagline:
          'Sistem Pemetaan Jurusan Pendidikan Tinggi dan Prospek Karir Berbasis Nilai Akademik Rapor di SMAN 1 Bandung. Jalan Ir. H. Juanda, Coblong, Kota Bandung.',
        columns: [
          {
            title: 'Peta Umum',
            links: [
              { label: 'Katalog Jurusan & Karir', href: '#katalog' },
              { label: 'Masuk Akun Siswa / Admin', href: '/login' },
            ],
          },
          {
            title: 'Portal Siswa',
            links: [
              { label: 'Hasil Mapping Jurusan & Karir', href: '/siswa' },
              { label: 'CRUD Nilai Rapor per Semester', href: '/siswa/input-nilai' },
              { label: 'Cetak Lembar Rekomendasi A4', href: '/siswa/cetak' },
            ],
          },
          {
            title: 'Portal Admin',
            links: [
              { label: 'Dashboard & Export XLSX', href: '/admin' },
              { label: 'CRUD Nilai Siswa', href: '/admin/input-nilai' },
              { label: 'CRUD Jurusan & Karir', href: '/admin/jurusan' },
              { label: 'Editor Bobot Mapel', href: '/admin/matriks-bobot' },
            ],
          },
        ],
        note: 'Kelompok A5 ITENAS · Foto lanskap via Unsplash',
      }}
    >
      {/* SECTION 2: KATALOG PEMETAAN UMUM JURUSAN, MAPEL & PROSPEK KARIR */}
      <section
        id="katalog"
        data-sec="katalog"
        className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-16 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#111211]/10">
          <div className="space-y-2.5">
            <span className="cairn-kicker">Pemetaan Umum</span>
            <h2 className="font-serif-cairn text-4xl sm:text-5xl text-[#111211] leading-[1.06]">
              Katalog jurusan kuliah, mata pelajaran
              <br />
              pendukung &amp; prospek karir.
            </h2>
            <p className="text-[15px] text-[#5c5f5b] max-w-2xl leading-relaxed">
              Setiap program studi perguruan tinggi memiliki bobot mata pelajaran rapor dan jalur profesi lulusan yang spesifik.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <label htmlFor="search-katalog" className="sr-only">
                Cari jurusan, mata pelajaran, atau karir
              </label>
              <Search
                className="w-4 h-4 text-[#878a86] absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="search-katalog"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari jurusan, mapel, karir..."
                className="w-full h-11 pl-10 pr-4 text-[13.5px] rounded-full bg-[#ebebe8] border border-[#111211]/10 text-[#111211] placeholder:text-[#878a86] focus:outline-none focus:border-[#2a6ee0]"
              />
            </div>
            <PillTabs
              tabs={rumpunTabs}
              activeTab={selectedRumpun}
              onChange={setSelectedRumpun}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-[#5c5f5b]">
            Memuat katalog jurusan, mata pelajaran, dan prospek karir...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJurusan.map((jur) => {
              const mapelPendukung = getMapelForJurusan(jur.id_jurusan);
              const karirProspek = getKarirForJurusan(jur.id_jurusan);

              return (
                <div
                  key={jur.id_jurusan}
                  className="cairn-card p-6 flex flex-col justify-between space-y-5 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <div className="space-y-4">
                    {/* Level 1: Header Jurusan */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f1f1ef] text-[#111211] font-mono-cairn text-[11px] uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e4572e]" />
                          {jur.rumpun}
                        </span>
                        <h3 className="font-serif-cairn text-[26px] leading-tight text-[#151615] mt-2">
                          {jur.nama_jurusan}
                        </h3>
                        <p className="text-[13px] text-[#686b67] mt-0.5">
                          {jur.fakultas}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#f1f1ef] text-[#151615] flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4" aria-hidden="true" />
                      </div>
                    </div>

                    <p className="text-[14px] text-[#5c5f5b] leading-relaxed">
                      {jur.deskripsi}
                    </p>

                    {/* Level 2: Divided Rows untuk Mata Pelajaran Pendukung (Tanpa 3-level nested box) */}
                    <div className="pt-3 border-t border-black/10 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-mono-cairn text-[11px] uppercase tracking-wider text-[#686b67]">
                        <BookOpen
                          className="w-3.5 h-3.5 text-[#2a6ee0]"
                          aria-hidden="true"
                        />
                        <span>Mata Pelajaran Pendukung</span>
                      </div>
                      <div className="divide-y divide-black/5 text-[13.5px]">
                        {mapelPendukung.length > 0 ? (
                          mapelPendukung.map((m) => (
                            <div
                              key={m.id_mapel}
                              className="py-1.5 flex items-center justify-between"
                            >
                              <span className="text-[#151615] font-medium">
                                {m.nama_mapel}
                              </span>
                              <span className="font-mono-cairn font-semibold text-[#e4572e] tabular-nums">
                                {m.bobot}%
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-[#878a86]">
                            Belum ada aturan mapel
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Level 2: Divided Rows untuk Prospek Karir */}
                    <div className="pt-3 border-t border-black/10 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-mono-cairn text-[11px] uppercase tracking-wider text-[#686b67]">
                        <Briefcase
                          className="w-3.5 h-3.5 text-[#e4572e]"
                          aria-hidden="true"
                        />
                        <span>Prospek Karir Lulusan</span>
                      </div>
                      <div className="divide-y divide-black/5 text-[13.5px]">
                        {karirProspek.length > 0 ? (
                          karirProspek.map((k) => (
                            <div
                              key={k.id_karir}
                              className="py-1.5 flex items-center justify-between gap-2"
                            >
                              <span className="font-medium text-[#151615]">
                                {k.profesi}
                              </span>
                              <span className="font-mono-cairn text-[11.5px] text-[#2a6ee0] shrink-0">
                                {k.prospek_masa_depan}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-[#878a86]">
                            Terbuka di berbagai sektor industri
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Card */}
                  <div className="pt-3 border-t border-black/10 flex items-center justify-between text-[12.5px] text-[#686b67]">
                    <span>
                      Passing Grade{' '}
                      <strong className="font-mono-cairn text-[#151615] tabular-nums">
                        {jur.passing_grade_indikatif}%
                      </strong>
                    </span>
                    <span className="truncate max-w-[180px]">
                      {Array.isArray(jur.universitas_favorit)
                        ? jur.universitas_favorit.slice(0, 2).join(', ')
                        : jur.universitas_favorit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SECTION 3: AJAKAN EVALUASI DETAIL BERDASARKAN NILAI RAPOR */}
        <div
          id="evaluasi-siswa"
          data-sec="evaluasi-siswa"
          className="rounded-2xl bg-[#0b0b0c] text-[#f2f2ef] p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 font-mono-cairn text-[11px] uppercase tracking-widest text-[#a5a7a2]">
              <span className="w-2 h-2 rounded-full bg-[#e4572e]" />
              Evaluasi Personal Berbasis Nilai Rapor
            </span>
            <h3 className="font-serif-cairn text-3xl sm:text-4xl text-white leading-tight">
              Lihat pemetaan detail berdasarkan nilai rapor Anda.
            </h3>
            <p className="text-[14.5px] text-[#a5a7a2] max-w-xl leading-relaxed">
              Masuk ke akun siswa menggunakan NISN untuk mengelola nilai rapor Semester 1 sampai 6 dan menghitung peringkat kecocokan jurusan beserta prospek karir secara otomatis.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 px-6 rounded-full bg-white text-[#111211] text-[14px] font-medium hover:bg-[#ebebe8] shrink-0 transition-colors"
          >
            <span>Masuk Akun Siswa</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </CairnAgentsLanding>
  );
}
