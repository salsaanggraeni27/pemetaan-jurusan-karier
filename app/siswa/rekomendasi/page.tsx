'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Award, 
  Compass, 
  Briefcase, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  TrendingUp, 
  Building2, 
  FileText, 
  Layers, 
  Filter, 
  ArrowRight,
  Printer,
  Sparkles
} from 'lucide-react';

export default function RekomendasiPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRumpun, setSelectedRumpun] = useState<string>('Semua');
  const [breakdownModalJurusan, setBreakdownModalJurusan] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sman1_user');
    if (!saved) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(saved);
    setUser(parsed);

    fetch(`/api/siswa/rekomendasi?siswaId=${parsed.id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setData(res.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">Menganalisis matriks rekomendasi...</div>;
  }

  if (!data || !data.results || data.results.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Belum Ada Hasil Rekomendasi</h2>
        <p className="text-xs text-slate-500">
          Silakan inputkan nilai rapor semester Anda terlebih dahulu agar mesin Rule-Based Matching dapat mengalkulasi peringkat jurusan.
        </p>
        <Link
          href="/siswa/input-nilai"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow transition hover:bg-blue-700"
        >
          Input Nilai Rapor Sekarang
        </Link>
      </div>
    );
  }

  const results = data.results;
  const filteredResults = selectedRumpun === 'Semua' 
    ? results 
    : results.filter((r: any) => r.jurusan.rumpun === selectedRumpun);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Kalkulasi Rule-Based Matching Berhasil
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Peringkat Rekomendasi Jurusan Kuliah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hasil pencocokan objektif nilai rapor <span className="font-semibold text-slate-800">{user?.nama}</span> ({user?.nisn_nip}) terhadap kriteria bobot program studi SMAN 1 Bandung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/siswa/cetak"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            Cetak Rekomendasi Resmi
          </Link>
          <Link
            href="/siswa/input-nilai"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs transition"
          >
            Ubah Nilai
          </Link>
        </div>
      </div>

      {/* Rumpun Filter & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Rumpun:
          </span>
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['Semua', 'Saintek', 'Soshum', 'Campuran'].map(rumpun => (
              <button
                key={rumpun}
                type="button"
                onClick={() => setSelectedRumpun(rumpun)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedRumpun === rumpun
                    ? 'bg-white text-blue-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {rumpun}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Menampilkan <strong>{filteredResults.length}</strong> jurusan terevaluasi
        </div>
      </div>

      {/* Recommended Majors List */}
      <div className="space-y-4">
        {filteredResults.map((item: any, idx: number) => {
          const isTopOne = item.ranking === 1;
          const linkedCareers = item.linkedCareer?.karirList || [];

          return (
            <div 
              key={item.jurusan.id_jurusan}
              className={`bg-white rounded-3xl border transition overflow-hidden shadow-sm hover:shadow-md ${
                isTopOne ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              {/* Header Ribbon for Top 1 */}
              {isTopOne && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    REKOMENDASI TERBAIK BERDASARKAN BOBOT RAPOR
                  </div>
                  <span>Skor Tertinggi #{item.ranking}</span>
                </div>
              )}

              <div className="p-6 sm:p-7 space-y-6">
                
                {/* Main Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left: Rank Badge + Title */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-inner ${
                      isTopOne 
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/30' 
                        : item.ranking <= 3 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      #{item.ranking}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.jurusan.rumpun === 'Saintek' 
                            ? 'bg-sky-100 text-sky-800' 
                            : item.jurusan.rumpun === 'Soshum' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {item.jurusan.rumpun}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.peluangStatus === 'Sangat Berpeluang' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : item.peluangStatus === 'Berpeluang Kompetitif'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.peluangStatus}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {item.jurusan.nama_jurusan}
                      </h3>
                      <p className="text-xs text-slate-500">{item.jurusan.fakultas}</p>
                    </div>
                  </div>

                  {/* Right: Score Metrics */}
                  <div className="flex items-center gap-6 bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-slate-200">
                    <div className="text-left sm:text-right">
                      <div className="text-3xl font-black text-blue-700 tracking-tight">
                        {item.normalizedScore}%
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">Skor Kecocokan</div>
                    </div>

                    <div className="border-l border-slate-200 pl-4 text-xs space-y-0.5 text-slate-500">
                      <div>Passing Grade: <strong>{item.jurusan.passing_grade_indikatif}%</strong></div>
                      <div>Daya Tampung: <strong>{item.jurusan.daya_tampung} Kursi</strong></div>
                    </div>
                  </div>

                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.jurusan.deskripsi}
                </p>

                {/* PTN Favorit Universitas */}
                {item.jurusan.universitas_favorit && (
                  <div className="text-xs flex flex-wrap items-center gap-2 text-slate-600 pt-1">
                    <span className="font-bold flex items-center gap-1 text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" /> Referensi Kampus PTN Favorit:
                    </span>
                    <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-800 font-medium">
                      {Array.isArray(item.jurusan.universitas_favorit) 
                        ? item.jurusan.universitas_favorit.join(', ') 
                        : item.jurusan.universitas_favorit}
                    </span>
                  </div>
                )}

                {/* Top Subjects Contribution Preview */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Mata Pelajaran Kunci (Bobot Terbesar):</span>
                    <button
                      type="button"
                      onClick={() => setBreakdownModalJurusan(item)}
                      className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 font-semibold"
                    >
                      Buka Rincian Formula Bobot <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {item.breakdown.slice(0, 4).map((b: any) => (
                      <div key={b.mapelId} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                        <div className="text-slate-500 font-medium truncate">{b.namaMapel}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-extrabold text-slate-900">Nilai: {b.nilaiSiswa}</span>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {b.bobot}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Linked Career Teaser */}
                {linkedCareers.length > 0 && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Peluang Karir: <strong>{linkedCareers.map((k: any) => k.profesi).slice(0, 2).join(', ')}</strong>
                      </span>
                    </div>

                    <Link
                      href="/siswa/eksplorasi-karir"
                      className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900"
                    >
                      Jelajahi Profil Karir & Gaji <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Formula Breakdown Modal */}
      {breakdownModalJurusan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase text-blue-600 tracking-wider">
                  Audit Transparansi Rule-Based Matching
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {breakdownModalJurusan.jurusan.nama_jurusan}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBreakdownModalJurusan(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900">
                Formula Perhitungan: <br />
                <code className="font-mono font-bold text-blue-800">
                  Total Skor = Σ (Nilai Siswa × Bobot Mapel) / Σ Bobot = {breakdownModalJurusan.normalizedScore}%
                </code>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="py-2.5 px-3 rounded-l-lg font-bold">Mata Pelajaran</th>
                      <th className="py-2.5 px-3 text-center font-bold">Nilai Siswa</th>
                      <th className="py-2.5 px-3 text-center font-bold">Bobot Aturan</th>
                      <th className="py-2.5 px-3 text-right rounded-r-lg font-bold">Kontribusi Skor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {breakdownModalJurusan.breakdown.map((row: any) => (
                      <tr key={row.mapelId} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{row.namaMapel}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-700">{row.nilaiSiswa}</td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-600">{row.bobot}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700">+{row.kontribusiSkor}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 font-extrabold text-slate-900">
                      <td className="py-3 px-3">Total Persentase Kecocokan</td>
                      <td className="py-3 px-3 text-center">-</td>
                      <td className="py-3 px-3 text-center">{breakdownModalJurusan.totalWeight}%</td>
                      <td className="py-3 px-3 text-right text-blue-700 text-sm">{breakdownModalJurusan.normalizedScore}%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setBreakdownModalJurusan(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Tutup Rincian
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
