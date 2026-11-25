'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nisn_nip: identifier, password }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        localStorage.setItem('sman1_user', JSON.stringify(data.user));
        router.push(data.user.role === 'GURU_BK' ? '/admin' : '/siswa');
      } else {
        setErrorMessage(
          data.message || 'Kombinasi NIS / Username dan password tidak sesuai.'
        );
      }
    } catch {
      setErrorMessage('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const loginQuick = async (nisn: string, pass: string) => {
    setIdentifier(nisn);
    setPassword(pass);
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nisn_nip: nisn, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem('sman1_user', JSON.stringify(data.user));
        router.push(data.user.role === 'GURU_BK' ? '/admin' : '/siswa');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full cairn-card p-7 sm:p-9 space-y-6">
        <div className="space-y-2 text-center">
          <span className="cairn-kicker mx-auto">Portal Akses Terpadu</span>
          <h1 className="font-serif-cairn text-4xl text-[#111211]">
            Masuk ke sistem pemetaan.
          </h1>
          <p className="text-[13px] text-[#5c5f5b] leading-relaxed">
            Masukkan NIS / NISN Siswa atau Akun Admin untuk langsung masuk sesuai hak akses Anda.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#e4572e]/10 border border-[#e4572e]/30 text-[#111211] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#e4572e]" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="identifier"
              className="block text-xs font-medium text-[#111211]"
            >
              NIS / NISN / Username
            </label>
            <input
              id="identifier"
              type="text"
              required
              placeholder="Contoh: 152023004 atau admin"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[#f1f1ef] border border-black/10 text-sm font-mono-cairn text-[#111211] focus:outline-none focus:border-[#2a6ee0]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-[#111211]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[#f1f1ef] border border-black/10 text-sm text-[#111211] focus:outline-none focus:border-[#2a6ee0]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cairn-pill w-full !h-11 !text-sm cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Memproses...' : 'Masuk Sekarang'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-black/10 space-y-2.5">
          <span className="font-mono-cairn text-[10.5px] uppercase tracking-wider text-[#686b67] block">
            Akun Demo Cepat (Klik untuk langsung masuk):
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => loginQuick('152023004', 'password123')}
              className="px-3 py-1.5 rounded-full bg-[#f1f1ef] hover:bg-[#111211] hover:text-white text-xs font-medium text-[#151615] transition-colors cursor-pointer"
            >
              NIS 152023004 (Sakhiy)
            </button>
            <button
              type="button"
              onClick={() => loginQuick('152023012', 'password123')}
              className="px-3 py-1.5 rounded-full bg-[#f1f1ef] hover:bg-[#111211] hover:text-white text-xs font-medium text-[#151615] transition-colors cursor-pointer"
            >
              NIS 152023012 (Salsa)
            </button>
            <button
              type="button"
              onClick={() => loginQuick('152023039', 'password123')}
              className="px-3 py-1.5 rounded-full bg-[#f1f1ef] hover:bg-[#111211] hover:text-white text-xs font-medium text-[#151615] transition-colors cursor-pointer"
            >
              NIS 152023039 (Kahla)
            </button>
            <button
              type="button"
              onClick={() => loginQuick('admin', 'admin')}
              className="px-3 py-1.5 rounded-full bg-[#111211] text-white hover:bg-[#e4572e] text-xs font-medium transition-colors cursor-pointer"
            >
              Akun Admin
            </button>
          </div>
        </div>

        <div className="text-center pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#5c5f5b] hover:text-[#111211]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Peta Umum</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
