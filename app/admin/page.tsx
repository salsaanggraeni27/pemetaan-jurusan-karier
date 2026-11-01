'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  GraduationCap, 
  Sliders, 
  Briefcase, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Filter,
  BarChart3,
  Sparkles
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setStats(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-500">Memuat dashboard bimbingan konseling...</div>;
  }

  const completionRate = stats?.totalSiswa > 0 
    ? Math.round((stats.siswaSelesai / stats.totalSiswa) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Panel Utama Guru Bimbingan &amp; Konseling (BK)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Pemetaan &amp; Rekapitulasi Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Kelola matriks pembobotan nilai per jurusan, pantau status pengisian rapor siswa SMAN 1 Bandung, dan evaluasi arah tren minat karir secara terpusat.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Siswa</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.totalSiswa || 0}</div>
          <p className="text-[11px] text-slate-500">Terdaftar di sistem BK</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selesai Pemetaan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700">{stats?.siswaSelesai || 0}</div>
          <p className="text-[11px] text-emerald-600 font-medium">{completionRate}% selesai dievaluasi</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Master Jurusan</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-700">{stats?.totalJurusan || 0}</div>
          <p className="text-[11px] text-slate-500">Program studi terkonfigurasi</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Katalog Karir</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-sky-700">{stats?.totalKarir || 0}</div>
          <p className="text-[11px] text-slate-500">Profesi industri terhubung</p>
        </div>

      </div>

      {/* Middle Section: Top Majors Analytics & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Distribution / Top Recommendations Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Statistik Algoritma</span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">Top Jurusan Paling Banyak Direkomendasikan</h3>
            </div>
            <span className="text-xs text-slate-400">Peringkat 1 siswa</span>
          </div>

          {stats?.topMajors?.length > 0 ? (
            <div className="space-y-4">
              {stats.topMajors.map((major: any, i: number) => {
                const totalRecom = stats.topMajors.reduce((a: number, b: any) => a + b.count, 0) || 1;
                const percentage = Math.round((major.count / totalRecom) * 100);

                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {i + 1}
                        </span>
                        {major.nama}
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                          {major.rumpun}
                        </span>
                      </span>
                      <span className="font-extrabold text-slate-700">
                        {major.count} Siswa ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada data rekomendasi siswa yang terkumpul.
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Kalkulasi 100% deterministik sesuai formula bobot guru BK.</span>
            <Link
              href="/admin/matriks-bobot"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Atur Matriks Bobot <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Col: Quick Admin Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pusat Konfigurasi BK</h4>

            <Link
              href="/admin/matriks-bobot"
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-indigo-50/70 text-slate-700 transition group border border-slate-100 hover:border-indigo-200"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">Matriks Aturan Bobot</div>
                <div className="text-[10px] text-slate-500">Konfigurasi bobot mapel per jurusan</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/admin/monitoring-siswa"
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-blue-50/70 text-slate-700 transition group border border-slate-100 hover:border-blue-200"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">Monitoring Siswa</div>
                <div className="text-[10px] text-slate-500">Rekapitulasi nilai &amp; rekomendasi</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/admin/jurusan"
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-slate-700 transition group border border-slate-100"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">Master Data Jurusan</div>
                <div className="text-[10px] text-slate-500">Passing grade &amp; daya tampung</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/admin/karir"
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-slate-700 transition group border border-slate-100"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">Master Data Karir</div>
                <div className="text-[10px] text-slate-500">Profesi &amp; relasi jurusan</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Student Submissions Table Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Rekapitulasi Siswa Terkini</h3>
            <p className="text-xs text-slate-500">Status evaluasi nilai rapor per siswa</p>
          </div>
          <Link
            href="/admin/monitoring-siswa"
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            Buka Tabel Lengkap Siswa →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-3 font-bold">Nama Siswa</th>
                <th className="py-2.5 px-3 font-bold">NISN</th>
                <th className="py-2.5 px-3 font-bold">Kelas</th>
                <th className="py-2.5 px-3 font-bold text-center">Status</th>
                <th className="py-2.5 px-3 font-bold">Rekomendasi Utama</th>
                <th className="py-2.5 px-3 font-bold text-right">Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.siswaList?.slice(0, 5).map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-800">{row.siswa.nama}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono">{row.siswa.nisn_nip}</td>
                  <td className="py-3 px-3 text-slate-700">{row.siswa.kelas || '-'}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      row.status === 'Selesai Pemetaan' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {row.topRekomendasi ? (
                      <span className="font-semibold text-slate-900">{row.topRekomendasi.nama}</span>
                    ) : (
                      <span className="text-slate-400 italic">Belum Mengisi Rapor</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-blue-700">
                    {row.topRekomendasi ? `${row.topRekomendasi.skor}%` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
