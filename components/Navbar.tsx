'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';

function CairnMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      fill="currentColor"
      className="transition-transform duration-500 group-hover:-rotate-6"
    >
      <ellipse cx="16" cy="25.6" rx="11.6" ry="4.4" />
      <ellipse cx="15" cy="16.7" rx="8" ry="3.5" />
      <ellipse cx="16.7" cy="9.5" rx="5.1" ry="2.6" />
      <ellipse cx="15.7" cy="4.3" rx="2.7" ry="1.6" />
    </svg>
  );
}

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
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, [pathname]);

  // CairnAgentsLanding di halaman utama ('/') sudah memiliki sticky header Cairn bawaan
  if (pathname === '/') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('sman1_user');
    setCurrentUser(null);
    router.push('/login');
  };

  const isBK = currentUser?.role === 'GURU_BK';
  const isSiswa = currentUser?.role === 'SISWA';

  const siswaNav = [
    { href: '/', label: 'Peta Umum' },
    { href: '/siswa', label: 'Hasil Mapping' },
    { href: '/siswa/input-nilai', label: 'Nilai Semester (CRUD)' },
  ];

  const bkNav = [
    { href: '/admin', label: 'Dashboard & Data Siswa' },
    { href: '/admin/input-nilai', label: 'CRUD Nilai Siswa' },
    { href: '/admin/jurusan', label: 'CRUD Jurusan & Karir' },
    { href: '/admin/matriks-bobot', label: 'Editor Bobot Mapel' },
  ];

  const navItems = isSiswa ? siswaNav : isBK ? bkNav : [{ href: '/', label: 'Peta Umum' }];

  return (
    <header className="sticky top-0 z-40 h-[68px] bg-[#f7f7f5]/85 backdrop-blur-md border-b border-[#111211]/10 no-print">
      <div className="max-w-7xl mx-auto px-5 sm:px-7 h-full flex items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href={isBK ? '/admin' : isSiswa ? '/siswa' : '/'}
          className="group inline-flex items-center gap-2.5 text-[#111211] font-semibold text-[18px] tracking-[-0.03em] shrink-0"
        >
          <CairnMark size={22} />
          <span>SMAN 1 Bandung</span>
        </Link>

        {/* Pill Navigation */}
        {navItems.length > 0 && (
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#ebebe8] border border-[#111211]/10">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`h-[32px] px-4 rounded-full text-[13px] font-medium inline-flex items-center transition-all ${
                    isActive
                      ? 'bg-[#111211] text-[#f7f7f5] shadow-sm'
                      : 'text-[#5c5f5b] hover:text-[#111211]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* User / Login Action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-[#5c5f5b] hidden sm:inline truncate max-w-[170px]">
                {currentUser.nama}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="cairn-pill-soft !h-[34px] !px-4 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <Link href="/login" className="cairn-pill !h-[34px]">
              Masuk Portal
            </Link>
          )}

          {navItems.length > 0 && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full bg-[#ebebe8] text-[#111211] flex items-center justify-center"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {mobileMenuOpen && navItems.length > 0 && (
        <div className="lg:hidden bg-[#f7f7f5] border-b border-[#111211]/10 px-5 py-4 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-full text-xs font-medium ${
                pathname === item.href
                  ? 'bg-[#111211] text-[#f7f7f5]'
                  : 'text-[#5c5f5b]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
