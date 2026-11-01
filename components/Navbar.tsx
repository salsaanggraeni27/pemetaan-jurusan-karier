'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  LogOut, 
  Menu, 
  X, 
  Sliders, 
  Users, 
  FileEdit,
  Award,
  Briefcase,
  Printer,
  LogIn
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sman1_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        // fallback
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('sman1_user');
    setCurrentUser(null);
    router.push('/login');
  };

  const isBK = currentUser?.role === 'GURU_BK';
  const isSiswa = currentUser?.role === 'SISWA';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <Link href={isBK ? '/admin' : isSiswa ? '/siswa' : '/'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight text-base sm:text-lg flex items-center gap-1.5">
                SMAN 1 Bandung
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  BK Care
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Pemetaan Jurusan &amp; Karir Berbasis Nilai</p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Strictly Separated by Role) */}
          <nav className="hidden md:flex items-center gap-1">
            {isSiswa ? (
              <>
                <Link
                  href="/siswa"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/siswa' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Beranda Siswa
                </Link>
                <Link
                  href="/siswa/rekomendasi"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/siswa/rekomendasi' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Hasil Rekomendasi
                </Link>
                <Link
                  href="/siswa/eksplorasi-karir"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/siswa/eksplorasi-karir' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Eksplorasi Karir
                </Link>
                <Link
                  href="/siswa/cetak"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/siswa/cetak' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Cetak Lembar BK
                </Link>
              </>
            ) : isBK ? (
              <>
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/admin' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard BK
                </Link>
                <Link
                  href="/admin/input-nilai"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/admin/input-nilai' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Input Nilai Siswa
                </Link>
                <Link
                  href="/admin/monitoring-siswa"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/admin/monitoring-siswa' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Monitoring Siswa
                </Link>
                <Link
                  href="/admin/matriks-bobot"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/admin/matriks-bobot' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Matriks Bobot
                </Link>
                <Link
                  href="/admin/jurusan"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/admin/jurusan' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Master Jurusan
                </Link>
                <Link
                  href="/admin/karir"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/admin/karir' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Master Karir
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Masuk ke Sistem
              </Link>
            )}
          </nav>

          {/* Right Action: User Info & Logout Button (NO role toggle switch) */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 truncate max-w-[170px]">
                    {currentUser.nama}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {isBK ? 'Guru BK SMAN 1 Bandung' : `Siswa (${currentUser.kelas || 'XII'})`}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Keluar / Ganti Akun"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-1 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Masuk ke Sistem
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          {currentUser ? (
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Akun Aktif:</p>
                <p className="text-sm font-bold text-slate-800">{currentUser.nama}</p>
                <p className="text-xs text-blue-600 font-semibold">
                  {isBK ? 'Guru Bimbingan & Konseling' : `Siswa (${currentUser.kelas || 'XII'})`}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Masuk ke Sistem
            </Link>
          )}

          <div className="space-y-1">
            {isSiswa ? (
              <>
                <Link
                  href="/siswa"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Beranda Siswa
                </Link>
                <Link
                  href="/siswa/rekomendasi"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Hasil Rekomendasi Jurusan
                </Link>
                <Link
                  href="/siswa/eksplorasi-karir"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Eksplorasi Prospek Karir
                </Link>
                <Link
                  href="/siswa/cetak"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Cetak Lembar BK Resmi
                </Link>
              </>
            ) : isBK ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Dashboard Guru BK
                </Link>
                <Link
                  href="/admin/input-nilai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Input Nilai Siswa
                </Link>
                <Link
                  href="/admin/monitoring-siswa"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Monitoring Rekapitulasi Siswa
                </Link>
                <Link
                  href="/admin/matriks-bobot"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Matriks Bobot Aturan
                </Link>
                <Link
                  href="/admin/jurusan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Master Data Jurusan
                </Link>
                <Link
                  href="/admin/karir"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Master Data Karir
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
