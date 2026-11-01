'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Compass, 
  BarChart3, 
  Briefcase, 
  Settings, 
  UserCheck, 
  LogOut, 
  Menu, 
  X, 
  Sliders, 
  Users, 
  BookOpen, 
  FileText
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Muat session user dari localStorage jika ada
    const saved = localStorage.getItem('sman1_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        // fallback
      }
    } else {
      // Default dummy session siswa Sakhiy
      const defaultUser = {
        id: 1,
        nisn_nip: '152023004',
        nama: 'Sakhiy Amru Abdillah',
        role: 'SISWA',
        kelas: 'XII-MIPA 1'
      };
      localStorage.setItem('sman1_user', JSON.stringify(defaultUser));
      setCurrentUser(defaultUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sman1_user');
    setCurrentUser(null);
    router.push('/login');
  };

  const switchRole = (role: 'SISWA' | 'GURU_BK') => {
    if (role === 'GURU_BK') {
      const bkUser = {
        id: 100,
        nisn_nip: '197805122002122001',
        nama: 'Dra. Hj. Ratna Juwita, M.Pd',
        role: 'GURU_BK',
        kelas: 'Koordinator Guru BK'
      };
      localStorage.setItem('sman1_user', JSON.stringify(bkUser));
      setCurrentUser(bkUser);
      router.push('/admin');
    } else {
      const siswaUser = {
        id: 1,
        nisn_nip: '152023004',
        nama: 'Sakhiy Amru Abdillah',
        role: 'SISWA',
        kelas: 'XII-MIPA 1'
      };
      localStorage.setItem('sman1_user', JSON.stringify(siswaUser));
      setCurrentUser(siswaUser);
      router.push('/siswa');
    }
    setMobileMenuOpen(false);
  };

  const isBK = currentUser?.role === 'GURU_BK';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
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
              <p className="text-xs text-slate-500 hidden sm:block">Pemetaan Jurusan & Karir Berbasis Nilai</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {!isBK ? (
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
                  href="/siswa/input-nilai"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/siswa/input-nilai' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Input Rapor
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
            ) : (
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
                  href="/admin/matriks-bobot"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/admin/matriks-bobot' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Matriks Bobot
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
                <Link
                  href="/admin/mapel"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === '/admin/mapel' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Mapel
                </Link>
              </>
            )}
          </nav>

          {/* Right Action: Role Switcher & User Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Fast Role Simulator Button */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => switchRole('SISWA')}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  !isBK ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Mode Siswa
              </button>
              <button
                onClick={() => switchRole('GURU_BK')}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  isBK ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Mode Guru BK
              </button>
            </div>

            {/* Current user card */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-800 truncate max-w-[150px]">
                    {currentUser.nama}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {currentUser.role === 'GURU_BK' ? 'Guru BK' : currentUser.kelas || 'Siswa'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Ganti Akun / Logout"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
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
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-400 font-medium">Masuk sebagai:</p>
              <p className="text-sm font-bold text-slate-800">{currentUser?.nama}</p>
              <p className="text-xs text-blue-600 font-medium">Role: {currentUser?.role}</p>
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => switchRole('SISWA')}
                className={`px-2 py-1 rounded ${!isBK ? 'bg-white font-bold text-blue-700' : 'text-slate-600'}`}
              >
                Siswa
              </button>
              <button
                onClick={() => switchRole('GURU_BK')}
                className={`px-2 py-1 rounded ${isBK ? 'bg-white font-bold text-indigo-700' : 'text-slate-600'}`}
              >
                Guru BK
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {!isBK ? (
              <>
                <Link
                  href="/siswa"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Beranda Siswa
                </Link>
                <Link
                  href="/siswa/input-nilai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Input Rapor Semester
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
            ) : (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Dashboard Guru BK
                </Link>
                <Link
                  href="/admin/matriks-bobot"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Matriks Bobot Aturan
                </Link>
                <Link
                  href="/admin/monitoring-siswa"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Monitoring Rekapitulasi Siswa
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
                <Link
                  href="/admin/mapel"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Master Mata Pelajaran
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
