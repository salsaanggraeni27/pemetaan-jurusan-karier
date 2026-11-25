'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  GraduationCap,
  Sliders,
  Download,
  Search,
  Eye,
  X,
} from 'lucide-react';
import { downloadXlsx } from '@/lib/export-xlsx';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any>(null);
  const [studentGrades, setStudentGrades] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then((r) => r.json()),
      fetch('/api/mapel').then((r) => r.json()),
    ])
      .then(([statsRes, mapelRes]) => {
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (mapelRes.success) {
          setMapelList(mapelRes.data || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenDetail = (siswaItem: any) => {
    setSelectedStudentDetail(siswaItem);
    fetch(`/api/siswa/nilai?siswaId=${siswaItem.siswa.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setStudentGrades(res.data || []);
      })
      .catch((err) => console.error(err));
  };

  const siswaList = stats?.siswaList || [];
  const filteredSiswa = siswaList.filter(
    (item: any) =>
      item.siswa.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.siswa.nisn_nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.siswa.kelas || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportXlsx = () => {
    const header = [
      'No',
      'NIS / NISN',
      'Nama Lengkap Siswa',
      'Kelas',
      'Jumlah Mapel Dinilai',
      'Rata-rata Nilai',
      'Status Pemetaan',
      'Rekomendasi Jurusan #1',
      'Rumpun',
      'Skor Kecocokan (%)',
      'Prospek Karir Terkait',
    ];

    const rows = filteredSiswa.map((row: any, idx: number) => [
      idx + 1,
      row.siswa.nisn_nip,
      row.siswa.nama,
      row.siswa.kelas || '-',
      row.totalMapelDiisi || 0,
      row.rataRata || 0,
      row.status,
      row.topRekomendasi ? row.topRekomendasi.nama : 'Belum dinilai',
      row.topRekomendasi ? row.topRekomendasi.rumpun : '-',
      row.topRekomendasi ? row.topRekomendasi.skor : 0,
      row.topRekomendasi?.karir?.length
        ? row.topRekomendasi.karir.join(', ')
        : '-',
    ]);

    downloadXlsx('Data_Pemetaan_Siswa_SMAN1_Bandung.xlsx', 'Data Siswa', [
      header,
      ...rows,
    ]);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-[#5c5f5b] text-sm">
        Memuat dashboard admin...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-7 py-10 space-y-7">
      {/* Header */}
      <div className="space-y-1.5">
        <span className="cairn-kicker">
          Panel Administrator &amp; Guru BK · SMAN 1 Bandung
        </span>
        <h1 className="font-serif-cairn text-4xl sm:text-5xl text-[#111211]">
          Dashboard data siswa &amp; modul CRUD.
        </h1>
      </div>

      {/* Menu ke CRUD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/input-nilai"
          className="cairn-card p-6 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-0.5 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#f1f1ef] text-[#e4572e] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif-cairn text-2xl text-[#111211] group-hover:text-[#e4572e]">
              CRUD Nilai Siswa
            </h2>
            <p className="text-xs text-[#686b67] mt-1 leading-relaxed">
              Kelola, tambah, ubah, dan hapus nilai rapor siswa per semester.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/jurusan"
          className="cairn-card p-6 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-0.5 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#f1f1ef] text-[#2a6ee0] flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif-cairn text-2xl text-[#111211] group-hover:text-[#2a6ee0]">
              CRUD Jurusan &amp; Karir
            </h2>
            <p className="text-xs text-[#686b67] mt-1 leading-relaxed">
              Kelola katalog jurusan kuliah, prospek karir, serta relasi keduanya.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/matriks-bobot"
          className="cairn-card p-6 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-0.5 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#f1f1ef] text-[#111211] flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif-cairn text-2xl text-[#111211] group-hover:text-[#e4572e]">
              Editor Bobot Mapel
            </h2>
            <p className="text-xs text-[#686b67] mt-1 leading-relaxed">
              Atur bobot mata pelajaran pendukung untuk masing-masing jurusan.
            </p>
          </div>
        </Link>
      </div>

      {/* Tabel Data Siswa (Read-Only + Export XLSX) */}
      <div className="cairn-card overflow-hidden">
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10">
          <div>
            <h2 className="font-serif-cairn text-2xl text-[#111211]">
              Data Siswa &amp; Hasil Pemetaan (Read-Only)
            </h2>
            <p className="text-xs text-[#686b67]">
              Total {filteredSiswa.length} siswa terdaftar. Unduh rekapitulasi dalam format Excel (.xlsx).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-60">
              <Search className="w-4 h-4 text-[#878a86] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIS, atau kelas..."
                className="w-full h-9 pl-10 pr-3 text-xs rounded-full bg-[#f1f1ef] border border-black/10 text-[#111211]"
              />
            </div>

            <button
              type="button"
              onClick={handleExportXlsx}
              className="cairn-pill cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export XLSX</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#f1f1ef] text-[#686b67] border-b border-black/10 font-mono-cairn text-[10.5px] uppercase tracking-wider">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">NIS / NISN</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4 text-center">Rata-rata</th>
                <th className="py-3 px-4">Hasil Jurusan #1</th>
                <th className="py-3 px-4">Prospek Karir</th>
                <th className="py-3 px-4 text-center">Skor</th>
                <th className="py-3 px-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filteredSiswa.map((row: any, idx: number) => (
                <tr key={row.siswa.id} className="hover:bg-[#f1f1ef]/60">
                  <td className="py-3.5 px-4 font-mono-cairn text-xs text-[#686b67]">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-mono-cairn text-xs text-[#151615]">
                    {row.siswa.nisn_nip}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#151615]">
                    {row.siswa.nama}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#686b67]">
                    {row.siswa.kelas || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono-cairn text-xs font-semibold text-[#2a6ee0]">
                    {row.rataRata || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    {row.topRekomendasi ? (
                      <span className="font-semibold text-[#151615]">
                        {row.topRekomendasi.nama}
                      </span>
                    ) : (
                      <span className="text-[#878a86]">Belum ada nilai</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#686b67]">
                    {row.topRekomendasi?.karir?.length
                      ? row.topRekomendasi.karir.slice(0, 2).join(', ')
                      : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono-cairn text-xs font-semibold text-[#e4572e]">
                    {row.topRekomendasi ? `${row.topRekomendasi.skor}%` : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(row)}
                      className="cairn-pill-soft !h-7 !px-3 !text-xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Read-Only Rincian Nilai Siswa */}
      {selectedStudentDetail && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="cairn-card max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-black/10">
              <div>
                <span className="cairn-kicker">Transkrip Read-Only</span>
                <h2 className="font-serif-cairn text-2xl text-[#111211] mt-1">
                  {selectedStudentDetail.siswa.nama} (
                  {selectedStudentDetail.siswa.kelas})
                </h2>
                <p className="text-xs font-mono-cairn text-[#686b67]">
                  NIS {selectedStudentDetail.siswa.nisn_nip}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="w-8 h-8 rounded-full bg-[#f1f1ef] text-[#111211] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-black/10 border border-black/10 rounded-xl text-xs">
              {studentGrades.length > 0 ? (
                studentGrades.map((g: any) => {
                  const m = mapelList.find(
                    (item) => item.id_mapel === g.id_mapel
                  );
                  return (
                    <div
                      key={g.id_nilai}
                      className="py-2.5 px-3.5 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-medium text-[#151615]">
                          {m ? m.nama_mapel : `Mapel #${g.id_mapel}`}
                        </span>
                        <span className="ml-2 font-mono-cairn text-[10.5px] text-[#686b67]">
                          (Sem {g.semester ?? 1})
                        </span>
                      </div>
                      <span className="font-mono-cairn font-semibold text-[#2a6ee0]">
                        {g.nilai}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-[#686b67]">
                  Belum ada nilai yang tersimpan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
