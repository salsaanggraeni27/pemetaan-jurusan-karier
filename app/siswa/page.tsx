'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Award, 
  Briefcase, 
  Printer, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  BookOpen,
  Lock,
  FileCheck
} from 'lucide-react';

export default function SiswaDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [recommendationData, setRecommendationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sman1_user');
    if (!saved) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(saved);
    if (parsed.role === 'GURU_BK') {
      router.push('/admin');
      return;
    }
    setUser(parsed);

    // Fetch recommendation status
    fetch(`/api/siswa/rekomendasi?siswaId=${parsed.id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setRecommendationData(res.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">
        Memuat data akademik siswa...
      </div>
    );
  }

  const topMajor = recommendationData?.results?.[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Portal Siswa • Layanan Bimbingan &amp; Konseling SMAN 1 Bandung
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {user?.nama || 'Siswa'}! 👋
            </h1>
            <p className="text-sm text-blue-100 mt-1">
              NISN: <span className="font-semibold text-white">{user?.nisn_nip}</span> • Kelas: <span className="font-semibold text-white">{user?.kelas || 'XII'}</span>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Sistem pemetaan ini mengevaluasi nilai rapor resmi Anda yang telah diverifikasi oleh Guru BK untuk merekomendasikan program studi perkuliahan serta prospek karir terbaik.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            {recommendationData ? (
              <>
                <Link
                  href="/siswa/rekomendasi"
                  className="px-5 py-2.5 rounded-xl bg-white text-blue-800 font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-blue-600" />
                  Lihat Hasil Rekomendasi Jurusan
                </Link>

                <Link
                  href="/siswa/eksplorasi-karir"
                  className="px-5 py-2.5 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur transition flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-amber-300" />
                  Eksplorasi Prospek Karir
                </Link>
              </>
            ) : (
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-xs text-blue-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Nilai rapor Anda sedang dalam proses input &amp; verifikasi oleh Guru BK.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Status & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Status Card or Top Recommendation */}
        <div className="lg:col-span-2 space-y-6">
          
          {recommendationData ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Hasil Pemetaan Akademik Anda</span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">Rekomendasi Utama (Peringkat #1)</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {topMajor?.peluangStatus}
                </span>
              </div>

              {/* Major Highlight Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-5 border border-blue-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-600 text-white mb-1.5">
                      Rumpun {topMajor?.jurusan.rumpun}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">
                      {topMajor?.jurusan.nama_jurusan}
                    </h4>
                    <p className="text-xs text-slate-500">{topMajor?.jurusan.fakultas}</p>
                  </div>
                  <div className="text-left sm:text-right bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-blue-200">
                    <span className="text-3xl font-black text-blue-700">{topMajor?.normalizedScore}%</span>
                    <p className="text-[11px] text-slate-500 font-medium">Skor Kecocokan Rule-Based</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {topMajor?.jurusan.deskripsi}
                </p>

                {/* Subject Contributors */}
                <div className="pt-2 border-t border-blue-100/70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700">Mata Pelajaran Pendukung Tertinggi:</span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <FileCheck className="w-3 h-3" /> Terverifikasi Guru BK
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {topMajor?.breakdown.slice(0, 3).map((item: any) => (
                      <div key={item.mapelId} className="bg-white p-2.5 rounded-xl border border-blue-100 text-xs">
                        <span className="text-[11px] text-slate-500 block truncate">{item.namaMapel}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-slate-800">Nilai: {item.nilaiSiswa}</span>
                          <span className="text-[10px] font-semibold text-blue-600">Bobot {item.bobot}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Linked Career Teaser */}
                {topMajor?.linkedCareer?.karirList?.length > 0 && (
                  <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span>Prospek Karir Unggulan: <strong>{topMajor.linkedCareer.karirList[0].profesi}</strong></span>
                    </div>
                    <Link
                      href="/siswa/eksplorasi-karir"
                      className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      Lihat Karir <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Other Recommendations Summary */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Opsi Rekomendasi Peringkat Berikutnya:</span>
                <div className="space-y-2">
                  {recommendationData.results.slice(1, 4).map((r: any) => (
                    <div key={r.jurusan.id_jurusan} className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-500 mr-2">#{r.ranking}</span>
                        <span className="font-bold text-slate-800">{r.jurusan.nama_jurusan}</span>
                        <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">{r.jurusan.rumpun}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-blue-700">{r.normalizedScore}%</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 hidden sm:inline">{r.peluangStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href="/siswa/rekomendasi"
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                >
                  Buka Halaman Analisis Rekomendasi Lengkap <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Nilai Rapor Belum Diinput oleh Guru BK</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Penginputan nilai rapor semester merupakan kewenangan resmi pihak Guru BK SMAN 1 Bandung. Silakan hubungi Guru BK Anda untuk verifikasi nilai rapor dan penjadwalan konsultasi studi lanjut.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
                <Clock className="w-4 h-4 text-amber-500" /> Menunggu input data nilai dari Guru BK
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Navigation & Academic Strengths */}
        <div className="space-y-6">
          
          {/* Quick Action Navigation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigasi Layanan Siswa</h4>

            <Link
              href="/siswa/rekomendasi"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
                <Award className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">Peringkat Jurusan</div>
                <div className="text-[10px] text-slate-500">Hasil kalkulasi Rule-Based</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/siswa/eksplorasi-karir"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">Katalog Prospek Karir</div>
                <div className="text-[10px] text-slate-500">Pohon profesi &amp; kualifikasi</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/siswa/input-nilai"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">Transkrip Nilai Rapor</div>
                <div className="text-[10px] text-slate-500">Nilai resmi terverifikasi BK</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/siswa/cetak"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                <Printer className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">Cetak Lembar Resmi BK</div>
                <div className="text-[10px] text-slate-500">Format print siap bimbingan</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Academic Strength Summary */}
          {recommendationData?.kekuatanAkademik && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Analisis Kekuatan Akademik</h4>
              
              <div>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mb-2">
                  <TrendingUp className="w-3.5 h-3.5" /> 3 Mata Pelajaran Terkuat:
                </span>
                <div className="space-y-1.5">
                  {recommendationData.kekuatanAkademik.terkuat.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                      <span className="font-medium text-slate-800">{item.namaMapel}</span>
                      <span className="font-bold text-emerald-700">{item.nilai}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mb-2">
                  <Clock className="w-3.5 h-3.5" /> Perlu Ditingkatkan:
                </span>
                <div className="space-y-1.5">
                  {recommendationData.kekuatanAkademik.perluDitingkatkan.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                      <span className="font-medium text-slate-800">{item.namaMapel}</span>
                      <span className="font-bold text-amber-700">{item.nilai}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
