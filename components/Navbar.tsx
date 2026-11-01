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
  LogIn,
  BookOpen
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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px] py-2 gap-3">
          
          {/* Logo Brand */}
          <Link 
            href={isBK ? '/admin' : isSiswa ? '/siswa' : '/'} 
            className="flex items-center gap-2.5 shrink-0 group py-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base flex items-center gap-1.5 whitespace-nowrap">
                <span>SMAN 1 Bandung</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                  BK Care
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block whitespace-nowrap">
                Pemetaan Jurusan &amp; Karir Siswa
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {isSiswa ? (
              <>
                <Link
                  href="/siswa"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    pathname === '/siswa' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Beranda Siswa
                </Link>
                <Link
                  href="/siswa/rekomendasi"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    pathname === '/siswa/rekomendasi' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Hasil Rekomendasi
                </Link>
                <Link
                  href="/siswa/eksplorasi-karir"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    pathname === '/siswa/eksplorasi-karir' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Eksplorasi Karir
                </Link>
                <Link
                  href="/siswa/cetak"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    pathname === '/siswa/cetak' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Cetak Lembar BK
                </Link>
              </>
            ) : isBK ? (
              <>
                <Link
                  href="/admin"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    pathname === '/admin' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard BK
                </Link>
                <Link
                  href="/admin/input-nilai"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    pathname === '/admin/input-nilai' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Input Nilai
                </Link>
                <Link
                  href="/admin/monitoring-siswa"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    pathname === '/admin/monitoring-siswa' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Monitoring Siswa
                </Link>
                <Link
                  href="/admin/matriks-bobot"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    pathname === '/admin/matriks-bobot' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Matriks Bobot
                </Link>
                <Link
                  href="/admin/jurusan"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    pathname === '/admin/jurusan' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Master Jurusan
                </Link>
                <Link
                  href="/admin/karir"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    pathname === '/admin/karir' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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

          {/* Right Action: User Info & Logout Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 truncate max-w-[130px] lg:max-w-[160px]">
                    {currentUser.nama}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {isBK ? 'Guru BK SMAN 1' : `Siswa (${currentUser.kelas || 'XII'})`}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Keluar / Ganti Akun"
                  className="px-2.5 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-1 text-xs font-bold border border-slate-200 hover:border-red-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Masuk
              </Link>
            )}

            {/* Mobile / Tablet menu toggle button */}
            <div className="flex xl:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          {currentUser ? (
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Akun Terhubung:</p>
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

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {isSiswa ? (
              <>
                <Link
                  href="/siswa"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 bg-slate-50"
                >
                  Beranda Siswa
                </Link>
                <Link
                  href="/siswa/rekomendasi"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 bg-slate-50"
                >
                  Hasil Rekomendasi
                </Link>
                <Link
                  href="/siswa/eksplorasi-karir"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 bg-slate-50"
                >
                  Eksplorasi Karir
                </Link>
                <Link
                  href="/siswa/cetak"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 bg-slate-50"
                >
                  Cetak Lembar BK
                </Link>
              </>
            ) : isBK ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 bg-slate-50"
                >
                  Dashboard BK
                </Link>
                <Link
                  href="/admin/input-nilai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 bg-slate-50"
                >
                  Input Nilai
                </Link>
                <Link
                  href="/admin/monitoring-siswa"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 bg-slate-50"
                >
                  Monitoring Siswa
                </Link>
                <Link
                  href="/admin/matriks-bobot"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 bg-slate-50"
                >
                  Matriks Bobot
                </Link>
                <Link
                  href="/admin/jurusan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 bg-slate-50"
                >
                  Master Jurusan
                </Link>
                <Link
                  href="/admin/karir"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 bg-slate-50"
                >
                  Master Karir
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
