import React from 'react';
import Link from 'next/link';
import { School, Code, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                S1
              </div>
              <span className="text-white font-bold text-lg tracking-tight">SMAN 1 Bandung • BK Care</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Aplikasi Web Pemetaan Jurusan Pendidikan Tinggi dan Prospek Karir Berbasis Nilai Akademik Rapor menggunakan metode Rule-Based Matching.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Mitra Pelaksanaan: SMA Negeri 1 Bandung (Jl. Ir. H. Juanda No. 93, Kota Bandung, Jawa Barat)
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" /> Tim Pengembang (Grup A5)
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>
                <span className="text-white font-medium">Sakhiy Amru Abdillah</span>
                <span className="block text-slate-500">152023004 - Project Manager & System Analyst</span>
              </li>
              <li>
                <span className="text-white font-medium">Ni Made Dwi Salsa Anggraeni</span>
                <span className="block text-slate-500">152023012 - Frontend Developer</span>
              </li>
              <li>
                <span className="text-white font-medium">Kahla Arsyaba</span>
                <span className="block text-slate-500">152023039 - Backend Developer</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <School className="w-4 h-4 text-blue-400" /> Informasi Akademik
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tugas Mata Kuliah IFB-401 Manajemen Projek<br />
              Tahun Akademik 2026-2027<br />
              Program Studi Informatika<br />
              Fakultas Teknologi Industri<br />
              Institut Teknologi Nasional Bandung (ITENAS)
            </p>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Sistem Pemetaan Jurusan & Karir - SMA Negeri 1 Bandung & Grup A5 ITENAS. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Rule-Based Engine 100% Deterministic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

