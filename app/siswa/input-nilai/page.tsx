'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileCheck, 
  Lock, 
  BookOpen, 
  ArrowRight, 
  Award, 
  Clock, 
  Sparkles,
  Info
} from 'lucide-react';

interface MapelItem {
  id_mapel: number;
  nama_mapel: string;
  kategori: string;
  deskripsi?: string;
}

export default function SiswaTranskripNilaiPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mapelList, setMapelList] = useState<MapelItem[]>([]);
  const [grades, setGrades] = useState<{ [mapelId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  useEffect(() => {
    const saved = localStorage.getItem('sman1_user');
    if (!saved) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(saved);
    if (parsed.role === 'GURU_BK') {
      router.push('/admin/input-nilai');
      return;
    }
    setUser(parsed);

    Promise.all([
      fetch('/api/mapel').then(res => res.json()),
      fetch(`/api/siswa/nilai?siswaId=${parsed.id}`).then(res => res.json())
    ]).then(([mapelRes, nilaiRes]) => {
      if (mapelRes.success) {
        setMapelList(mapelRes.data);
      }

      const initialGradesMap: { [id: number]: number } = {};
      if (nilaiRes.success && Array.isArray(nilaiRes.data)) {
        nilaiRes.data.forEach((n: any) => {
          initialGradesMap[n.id_mapel] = n.nilai;
        });
      }
      setGrades(initialGradesMap);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [router]);

  const filledCount = Object.keys(grades).length;
  const gradeValues = Object.values(grades);
  const avgGrade = gradeValues.length > 0 
    ? (gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(1) 
    : '0';

  const categories = ['Semua', 'Wajib', 'Peminatan MIPA', 'Peminatan IPS', 'Peminatan Bahasa'];
  const filteredMapel = activeCategory === 'Semua' 
    ? mapelList 
    : mapelList.filter(m => m.kategori === activeCategory);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">Memuat transkrip nilai siswa...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            Transkrip Nilai Rapor Resmi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rekap Nilai Rapor Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data nilai akademik rapor milik <span className="font-bold text-slate-800">{user?.nama}</span> (NISN: {user?.nisn_nip}) yang terdaftar di SMAN 1 Bandung.
          </p>
        </div>

        {/* Live Metrics Pill */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Terverifikasi</span>
            <span className="font-extrabold text-slate-800 text-sm">{filledCount} / {mapelList.length} Mapel</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rata-Rata</span>
            <span className="font-extrabold text-blue-600 text-sm">{avgGrade}</span>
          </div>
        </div>
      </div>

      {/* Authority Notice Card (Read-Only) */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-amber-900 block">Kewenangan Penginputan Nilai: Guru BK SMAN 1 Bandung</span>
          <p className="text-amber-800/90 leading-relaxed">
            Sesuai aturan sekolah, input dan pembaruan nilai rapor hanya dapat dilakukan secara resmi oleh Guru Bimbingan &amp; Konseling (BK) guna menjaga keabsahan data akademik. Halaman ini hanya menampilkan data yang telah diverifikasi.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 text-xs font-semibold">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Read-Only Grades Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredMapel.map(mapel => {
          const currentVal = grades[mapel.id_mapel];
          const isFilled = currentVal !== undefined && currentVal !== null;

          return (
            <div 
              key={mapel.id_mapel}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                  {mapel.kategori}
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {mapel.nama_mapel}
                </h4>
                {mapel.deskripsi && (
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{mapel.deskripsi}</p>
                )}
              </div>

              <div className="text-right shrink-0 pl-3">
                {isFilled ? (
                  <div className="bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xl text-center">
                    <span className="text-xl font-black text-blue-700">{currentVal}</span>
                    <span className="block text-[9px] text-blue-600 font-bold uppercase">Terverifikasi</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Belum Diinput</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Step CTA */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">Ingin Melihat Hasil Pemetaan Jurusan Anda?</h3>
          <p className="text-xs text-blue-100 mt-0.5">
            Nilai di atas telah diproses oleh Rule-Based Matching Engine untuk menentukan program studi terbaik.
          </p>
        </div>

        <Link
          href="/siswa/rekomendasi"
          className="px-6 py-3 rounded-xl bg-white text-blue-800 font-bold text-xs shadow-md hover:bg-blue-50 transition flex items-center gap-2 shrink-0"
        >
          <Award className="w-4 h-4 text-blue-600" />
          Lihat Peringkat Rekomendasi Jurusan
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
