'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Eye, 
  GraduationCap, 
  Printer, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function MonitoringSiswaPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any>(null);
  const [studentGrades, setStudentGrades] = useState<any[]>([]);
  const [mapelList, setMapelList] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(res => res.json()),
      fetch('/api/mapel').then(res => res.json())
    ]).then(([statsRes, mapelRes]) => {
      if (statsRes.success) setData(statsRes.data);
      if (mapelRes.success) setMapelList(mapelRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleOpenDetail = (siswaItem: any) => {
    setSelectedStudentDetail(siswaItem);
    fetch(`/api/siswa/nilai?siswaId=${siswaItem.siswa.id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setStudentGrades(res.data);
      })
      .catch(err => console.error(err));
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-500">Memuat rekapitulasi data siswa...</div>;
  }

  const siswaList = data?.siswaList || [];

  // Filter Logic
  const filteredList = siswaList.filter((item: any) => {
    const matchSearch = item.siswa.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.siswa.nisn_nip.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKelas = selectedKelas === 'Semua' || item.siswa.kelas === selectedKelas;
    const matchStatus = selectedStatus === 'Semua' || item.status === selectedStatus;
    return matchSearch && matchKelas && matchStatus;
  });

  const uniqueClasses = ['Semua', ...Array.from(new Set(siswaList.map((s: any) => s.siswa.kelas || 'XII')))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            Monitoring Siswa Terpusat
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rekapitulasi Hasil Pemetaan Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data pemantauan seluruh siswa SMAN 1 Bandung, progres pengisian rapor, serta rekomendasi jurusan tertinggi.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 w-fit no-print"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          Cetak Rekapitulasi BK
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau NISN siswa..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Kelas:</span>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none"
            >
              {uniqueClasses.map((k: any) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Selesai Pemetaan">Selesai Pemetaan</option>
              <option value="Belum Lengkap">Belum Lengkap</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-4 font-bold">No</th>
                <th className="py-3 px-4 font-bold">Nama Lengkap Siswa</th>
                <th className="py-3 px-4 font-bold">NISN</th>
                <th className="py-3 px-4 font-bold">Kelas</th>
                <th className="py-3 px-4 font-bold text-center">Status Pemetaan</th>
                <th className="py-3 px-4 font-bold">Rekomendasi Utama (Rank 1)</th>
                <th className="py-3 px-4 font-bold text-center">Skor Kecocokan</th>
                <th className="py-3 px-4 font-bold text-right no-print">Aksi BK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((row: any, idx: number) => {
                const isFinished = row.status === 'Selesai Pemetaan';

                return (
                  <tr key={row.siswa.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{row.siswa.nama}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{row.siswa.nisn_nip}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{row.siswa.kelas || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isFinished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isFinished ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {row.topRekomendasi ? (
                        <div>
                          <div className="font-bold text-slate-900">{row.topRekomendasi.nama}</div>
                          <span className="text-[10px] text-blue-600 font-semibold">{row.topRekomendasi.rumpun}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Nilai belum diinput</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.topRekomendasi ? (
                        <span className="font-black text-blue-700 text-sm">{row.topRekomendasi.skor}%</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right no-print">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(row)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase text-blue-600 tracking-wider">
                  Detail Rekapitulasi Rapor Siswa
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedStudentDetail.siswa.nama} ({selectedStudentDetail.siswa.kelas})
                </h3>
                <p className="text-xs text-slate-500 font-mono">NISN: {selectedStudentDetail.siswa.nisn_nip}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Top Major Info */}
            {selectedStudentDetail.topRekomendasi && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Rekomendasi Utama Terhitung</span>
                  <div className="font-extrabold text-slate-900 text-base">{selectedStudentDetail.topRekomendasi.nama}</div>
                  <div className="text-xs text-slate-500">Rumpun: {selectedStudentDetail.topRekomendasi.rumpun}</div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-700">{selectedStudentDetail.topRekomendasi.skor}%</span>
                  <div className="text-[10px] text-slate-400">Skor Kecocokan</div>
                </div>
              </div>
            )}

            {/* Grades Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Daftar Nilai Rapor Siswa:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {studentGrades.map((g: any) => {
                  const m = mapelList.find(item => item.id_mapel === g.id_mapel);
                  return (
                    <div key={g.id_mapel} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <span className="font-medium text-slate-700 truncate pr-2">{m ? m.nama_mapel : `Mapel ${g.id_mapel}`}</span>
                      <span className="font-black text-blue-700">{g.nilai}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Tutup Jendela
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
