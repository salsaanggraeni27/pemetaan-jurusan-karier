'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Compass, 
  Target, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Users, 
  Cpu, 
  FileSpreadsheet,
  Award,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const handleQuickDemo = (userObj: any, destination: string) => {
    localStorage.setItem('sman1_user', JSON.stringify(userObj));
    router.push(destination);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-medium backdrop-blur">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Layanan Resmi Bimbingan & Konseling SMAN 1 Bandung
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Pemetaan Jurusan Kuliah &amp; Prospek Karir <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Berbasis Nilai Akademik Rapor
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Bantu siswa SMAN 1 Bandung menemukan program studi perguruan tinggi yang paling realistis dengan rekam jejak akademik menggunakan metode <span className="text-white font-semibold underline decoration-sky-400 decoration-2">Rule-Based Matching</span>, lengkap dengan katalog prospek karir masa depan.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/siswa/input-nilai"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
            >
              <Compass className="w-5 h-5" />
              Mulai Pemetaan Nilai Rapor
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold backdrop-blur flex items-center justify-center gap-2 transition hover:scale-[1.02]"
            >
              <Users className="w-5 h-5 text-sky-400" />
              Dashboard Guru BK
            </Link>
          </div>

          {/* Quick Demo Access Box */}
          <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur max-w-2xl mx-auto">
            <p className="text-xs text-sky-300 font-semibold uppercase tracking-wider mb-3">
              ⚡ Simulasi Cepat (Pilih Akun Demo Siswa / Guru BK):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                onClick={() => handleQuickDemo({
                  id: 1,
                  nisn_nip: '152023004',
                  nama: 'Sakhiy Amru Abdillah',
                  role: 'SISWA',
                  kelas: 'XII-MIPA 1'
                }, '/siswa')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition"
              >
                <div className="font-bold text-white truncate">Sakhiy Amru</div>
                <div className="text-[10px] text-sky-200">Siswa MIPA (Tech)</div>
              </button>

              <button
                onClick={() => handleQuickDemo({
                  id: 2,
                  nisn_nip: '152023012',
                  nama: 'Ni Made Salsa',
                  role: 'SISWA',
                  kelas: 'XII-MIPA 2'
                }, '/siswa')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition"
              >
                <div className="font-bold text-white truncate">Ni Made Salsa</div>
                <div className="text-[10px] text-emerald-200">Siswa MIPA (Med)</div>
              </button>

              <button
                onClick={() => handleQuickDemo({
                  id: 3,
                  nisn_nip: '152023039',
                  nama: 'Kahla Arsyaba',
                  role: 'SISWA',
                  kelas: 'XII-IPS 1'
                }, '/siswa')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition"
              >
                <div className="font-bold text-white truncate">Kahla Arsyaba</div>
                <div className="text-[10px] text-amber-200">Siswa IPS (Sos)</div>
              </button>

              <button
                onClick={() => handleQuickDemo({
                  id: 100,
                  nisn_nip: '197805122002122001',
                  nama: 'Dra. Hj. Ratna Juwita',
                  role: 'GURU_BK',
                  kelas: 'Koordinator BK'
                }, '/admin')}
                className="p-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 border border-indigo-400/30 text-left transition"
              >
                <div className="font-bold text-white truncate">Guru BK (Ratna)</div>
                <div className="text-[10px] text-indigo-200">Admin Dashboard</div>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Tahap Blueprint Alur Kerja Sistem */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Blueprint Arsitektur Sistem</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Alur Pemrosesan Rekomendasi Terpadu (4 Tahapan)
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            Pemisahan tugas yang jelas antara otoritas Guru BK, data akademik siswa, dan otomasi mesin pencocokan aturan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-blue-400 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Konfigurasi Guru BK</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Guru BK mengonfigurasi matriks bobot mata pelajaran pendukung untuk setiap program studi dan memetakan referensi karir.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-blue-400 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Input Nilai Siswa</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Siswa menginputkan nilai rapor mata pelajaran (Wajib & Peminatan) melalui antarmuka web mobile-friendly yang responsif.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-blue-400 transition">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Rule-Based Engine</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem menghitung total skor kecocokan dengan formula: <br />
              <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">
                Skor = Σ(Nilai × Bobot)
              </code> secara deterministik dan objektif.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-blue-400 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-4">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Penyajian & Karir</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Siswa memperoleh peringkat jurusan rekomendasi, passing grade indikatif, rujukan kampus PTN, dan visualisasi prospek karir masa depan.
            </p>
          </div>

        </div>
      </section>

      {/* Nilai Lebih Solusi vs Masalah Konvensional */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Akar Masalah &amp; Solusi Nyata</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Mengapa SMAN 1 Bandung Memerlukan Sistem Ini?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sebelum adanya aplikasi ini, panduan penjurusan masih berupa dokumen tertulis tebal dan rekapitulasi nilai manual satu per satu. Hal tersebut memicu tingginya antrean konsultasi tatap muka hingga Guru BK kewalahan, serta risiko ketidakcocokan jurusan (major mismatch) saat seleksi SNBP/SNBT.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">Transparan & 100% Bebas Bias</h5>
                    <p className="text-xs text-slate-600">Rekomendasi dihitung murni dari aturan bobot nilai akademik rapor tanpa penilaian subjektif.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">Efisiensi Konsultasi BK Meningkat</h5>
                    <p className="text-xs text-slate-600">Guru BK tidak perlu lagi menghitung manual kecocokan nilai siswa, cukup pantau melalui dashboard terpusat.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">Jembatan Nyata Menuju Dunia Karir</h5>
                    <p className="text-xs text-slate-600">Menghubungkan jurusan kuliah dengan profesi konkret, estimasi gaji, dan kualifikasi yang dibutuhkan.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    BK
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Format Rekomendasi Resmi</h4>
                    <p className="text-xs text-slate-500">SMA Negeri 1 Bandung</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Terverifikasi
                </span>
              </div>

              {/* Sample output preview */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-blue-700">Peringkat 1 (Sangat Berpeluang)</span>
                    <h5 className="text-sm font-bold text-slate-900">Teknik Informatika / Ilmu Komputer</h5>
                    <p className="text-xs text-slate-500">Bobot utama: Mat Lanjut (30%), Informatika (30%)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-blue-700">92.4%</span>
                    <p className="text-[10px] text-slate-400">Skor Kecocokan</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600">Peringkat 2 (Berpeluang)</span>
                    <h5 className="text-sm font-bold text-slate-800">Teknik Elektro &amp; Mekatronika</h5>
                    <p className="text-xs text-slate-500">Bobot utama: Fisika (35%), Mat Lanjut (30%)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-slate-700">86.8%</span>
                    <p className="text-[10px] text-slate-400">Skor Kecocokan</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600">Peringkat 3 (Berpeluang)</span>
                    <h5 className="text-sm font-bold text-slate-800">Teknik Industri &amp; Rantai Pasok</h5>
                    <p className="text-xs text-slate-500">Bobot utama: Mat Lanjut (25%), Ekonomi (20%)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-slate-700">84.2%</span>
                    <p className="text-[10px] text-slate-400">Skor Kecocokan</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/siswa/input-nilai"
                  className="block text-center py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
                >
                  Coba Sekarang dengan Nilai Anda Sendiri
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
