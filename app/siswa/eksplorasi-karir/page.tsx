'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Search, 
  TrendingUp, 
  DollarSign, 
  GraduationCap, 
  CheckCircle, 
  Sparkles, 
  Tag, 
  ChevronRight,
  Filter
} from 'lucide-react';

export default function EksplorasiKarirPage() {
  const [karirList, setKarirList] = useState<any[]>([]);
  const [jurusanList, setJurusanList] = useState<any[]>([]);
  const [relasiList, setRelasiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProspek, setSelectedProspek] = useState('Semua');

  useEffect(() => {
    Promise.all([
      fetch('/api/karir').then(res => res.json()),
      fetch('/api/jurusan').then(res => res.json())
    ]).then(([karirRes, jurRes]) => {
      if (karirRes.success) {
        setKarirList(karirRes.data || []);
        setRelasiList(karirRes.relasi || []);
      }
      if (jurRes.success) {
        setJurusanList(jurRes.data || []);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredKarir = karirList.filter(k => {
    const matchSearch = k.profesi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        k.industri.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        k.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProspek = selectedProspek === 'Semua' || k.prospek_masa_depan === selectedProspek;
    return matchSearch && matchProspek;
  });

  const getJurusanForKarir = (karirId: number) => {
    const matchedRelasi = relasiList.filter(r => r.id_karir === karirId);
    const jurIds = new Set(matchedRelasi.map(r => r.id_jurusan));
    return jurusanList.filter(j => jurIds.has(j.id_jurusan));
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">Memuat katalog prospek karir...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <Briefcase className="w-3.5 h-3.5" />
          Modul Career Linker Service
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Katalog Prospek Karir &amp; Kualifikasi Industri
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Temukan gambaran konkrit mengenai dunia kerja nyata setelah lulus dari jurusan kuliah, mencakup rentang estimasi gaji, kualifikasi keahlian, dan jurusan kuliah yang relevan.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari profesi, skill, atau industri..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        {/* Filter Prospek */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Prospek Masa Depan:</span>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto">
            {['Semua', 'Sangat Tinggi', 'Tinggi', 'Stabil'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedProspek(p)}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition ${
                  selectedProspek === p ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredKarir.map((karir) => {
          const relatedMajors = getJurusanForKarir(karir.id_karir);

          return (
            <div 
              key={karir.id_karir}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-blue-400 transition hover:shadow-md space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {karir.industri}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {karir.profesi}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                    karir.prospek_masa_depan === 'Sangat Tinggi'
                      ? 'bg-emerald-100 text-emerald-800'
                      : karir.prospek_masa_depan === 'Tinggi'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    ★ Prospek {karir.prospek_masa_depan}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {karir.deskripsi}
                </p>

                {/* Salary Range */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    Rp
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Estimasi Rentang Gaji (Indonesia)</span>
                    <span className="font-extrabold text-slate-800">{karir.estimasi_gaji}</span>
                  </div>
                </div>

                {/* Key Qualifications / Skills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 block">Kualifikasi &amp; Skill Kunci:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(karir.kualifikasi_utama) ? karir.kualifikasi_utama : karir.kualifikasi_utama?.split(',') || []).map((skill: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-100">
                        {typeof skill === 'string' ? skill.trim() : skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Majors in SMAN 1 Bandung DB */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                  Jurusan Kuliah Terkait:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {relatedMajors.length > 0 ? (
                    relatedMajors.map(m => (
                      <Link
                        key={m.id_jurusan}
                        href="/siswa/rekomendasi"
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-800 hover:text-blue-800 font-medium transition"
                      >
                        <GraduationCap className="w-3 h-3 text-blue-600" />
                        {m.nama_jurusan}
                      </Link>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Terbuka untuk berbagai rumpun ilmu</span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

