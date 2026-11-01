'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, ShieldCheck, User, KeyRound, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'SISWA' | 'GURU_BK'>('SISWA');
  const [nisnNip, setNisnNip] = useState('152023004'); // default Sakhiy
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTabChange = (tab: 'SISWA' | 'GURU_BK') => {
    setActiveTab(tab);
    setErrorMessage('');
    if (tab === 'SISWA') {
      setNisnNip('152023004');
      setPassword('password123');
    } else {
      setNisnNip('197805122002122001');
      setPassword('adminbk123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nisn_nip: nisnNip, password })
      });
      const data = await res.json();

      if (data.success && data.user) {
        localStorage.setItem('sman1_user', JSON.stringify(data.user));
        if (data.user.role === 'GURU_BK') {
          router.push('/admin');
        } else {
          router.push('/siswa');
        }
      } else {
        setErrorMessage(data.message || 'Login gagal. Periksa kembali NISN/NIP dan Password.');
      }
    } catch (err: any) {
      setErrorMessage('Terjadi kesalahan jaringan atau server.');
    } finally {
      setLoading(false);
    }
  };

  const setQuickUser = (nisn: string, pass: string, role: 'SISWA' | 'GURU_BK') => {
    setActiveTab(role);
    setNisnNip(nisn);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Portal Bimbingan Konseling
          </h2>
          <p className="text-xs text-slate-500">
            SMA Negeri 1 Bandung • Masuk untuk memulai pemetaan
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleTabChange('SISWA')}
              className={`py-2 rounded-lg transition ${
                activeTab === 'SISWA' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Akses Siswa
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('GURU_BK')}
              className={`py-2 rounded-lg transition ${
                activeTab === 'GURU_BK' ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Akses Guru BK / Admin
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {activeTab === 'SISWA' ? 'Nomor Induk Siswa Nasional (NISN)' : 'Nomor Induk Pegawai (NIP) / User Admin'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={nisnNip}
                  onChange={(e) => setNisnNip(e.target.value)}
                  placeholder={activeTab === 'SISWA' ? 'Contoh: 152023004' : 'Contoh: 197805122002122001'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password akun"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white shadow-md transition flex items-center justify-center gap-2 ${
                activeTab === 'SISWA'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Preset Buttons for convenience */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Pilih Akun Cepat Pengujian:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setQuickUser('152023004', 'password123', 'SISWA')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-left transition"
              >
                <div className="font-bold text-slate-800">Sakhiy Amru</div>
                <div className="text-[10px] text-slate-500">XII-MIPA 1 (Siswa)</div>
              </button>
              <button
                type="button"
                onClick={() => setQuickUser('152023012', 'password123', 'SISWA')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-left transition"
              >
                <div className="font-bold text-slate-800">Ni Made Salsa</div>
                <div className="text-[10px] text-slate-500">XII-MIPA 2 (Siswa)</div>
              </button>
              <button
                type="button"
                onClick={() => setQuickUser('152023039', 'password123', 'SISWA')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-left transition"
              >
                <div className="font-bold text-slate-800">Kahla Arsyaba</div>
                <div className="text-[10px] text-slate-500">XII-IPS 1 (Siswa)</div>
              </button>
              <button
                type="button"
                onClick={() => setQuickUser('197805122002122001', 'adminbk123', 'GURU_BK')}
                className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-left transition"
              >
                <div className="font-bold">Dra. Ratna Juwita</div>
                <div className="text-[10px] text-indigo-600">Guru BK (Admin)</div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
