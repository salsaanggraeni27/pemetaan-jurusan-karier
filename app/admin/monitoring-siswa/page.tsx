'use client';

import React, { useState, useEffect } from 'react';
import { Download, Search, Eye, X } from 'lucide-react';
import { downloadXlsx } from '@/lib/export-xlsx';

export default function MonitoringSiswaPage() {
  const [data, setData] = useState<any>(null);
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any>(null);
  const [studentGrades, setStudentGrades] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then((res) => res.json()),
      fetch('/api/mapel').then((res) => res.json()),
    ])
      .then(([statsRes, mapelRes]) => {
        if (statsRes.success) setData(statsRes.data);
        if (mapelRes.success) setMapelList(mapelRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-[#6e6e6e] text-sm">
        Memuat data siswa...
      </div>
    );
  }

  const siswaList = data?.siswaList || [];
  const filteredList = siswaList.filter(
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

    const rows = filteredList.map((row: any, idx: number) => [
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

    downloadXlsx('Data_Siswa_ReadOnly_SMAN1_Bandung.xlsx', 'Data Siswa', [
      header,
      ...rows,
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#6e6e6e]">
            Rekapitulasi Data Siswa (Read-Only) · SMAN 1 Bandung
          </span>
          <h1 className="text-2xl font-bold text-[#333333] tracking-tight">
            Data Siswa &amp; Export XLSX
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#6e6e6e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIS, atau kelas..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg bg-white border border-[#cccccc] text-[#333333]"
            />
          </div>

          <button
            type="button"
            onClick={handleExportXlsx}
            className="inline-flex h-9 items-center gap-1.5 px-3.5 rounded-lg bg-[#2f4b79] hover:opacity-95 text-white text-xs font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export XLSX</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#cccccc] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#f4f5f7] text-[#6e6e6e] border-b border-[#cccccc] text-xs">
                <th className="py-3 px-4 font-medium">No</th>
                <th className="py-3 px-4 font-medium">NIS / NISN</th>
                <th className="py-3 px-4 font-medium">Nama Siswa</th>
                <th className="py-3 px-4 font-medium">Kelas</th>
                <th className="py-3 px-4 font-medium text-center">Rata-rata</th>
                <th className="py-3 px-4 font-medium">Rekomendasi #1</th>
                <th className="py-3 px-4 font-medium">Prospek Karir</th>
                <th className="py-3 px-4 font-medium text-center">Skor</th>
                <th className="py-3 px-4 font-medium text-right">Rapor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cccccc]/60">
              {filteredList.map((row: any, idx: number) => (
                <tr key={row.siswa.id} className="hover:bg-[#f4f5f7]/60">
                  <td className="py-3 px-4 font-mono text-xs text-[#6e6e6e]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[#333333]">
                    {row.siswa.nisn_nip}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#333333]">
                    {row.siswa.nama}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#6e6e6e]">
                    {row.siswa.kelas || '-'}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-xs font-bold text-[#2f4b79]">
                    {row.rataRata || '-'}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {row.topRekomendasi ? (
                      <span className="font-semibold text-[#333333]">
                        {row.topRekomendasi.nama}
                      </span>
                    ) : (
                      <span className="text-[#6e6e6e]">Belum diinput</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#6e6e6e]">
                    {row.topRekomendasi?.karir?.length
                      ? row.topRekomendasi.karir.slice(0, 2).join(', ')
                      : '-'}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-xs font-bold text-[#df6035]">
                    {row.topRekomendasi ? `${row.topRekomendasi.skor}%` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(row)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#cccccc] bg-[#f4f5f7] hover:bg-[#e8ebed] text-xs font-medium text-[#333333] cursor-pointer"
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

      {selectedStudentDetail && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-[#cccccc] shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#cccccc]">
              <div>
                <span className="text-xs text-[#6e6e6e]">
                  Transkrip Rapor Siswa (Read-Only)
                </span>
                <h2 className="text-lg font-bold text-[#333333]">
                  {selectedStudentDetail.siswa.nama} (
                  {selectedStudentDetail.siswa.kelas})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="w-8 h-8 rounded-md bg-[#f4f5f7] hover:bg-[#e8ebed] text-[#333333] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-[#cccccc]/60 border border-[#cccccc] rounded-lg text-xs">
              {studentGrades.map((g: any) => {
                const m = mapelList.find(
                  (item) => item.id_mapel === g.id_mapel
                );
                return (
                  <div
                    key={g.id_nilai}
                    className="py-2 px-3 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium text-[#333333]">
                        {m ? m.nama_mapel : `Mapel ${g.id_mapel}`}
                      </span>
                      <span className="ml-2 text-[11px] text-[#6e6e6e]">
                        (Sem {g.semester ?? 1})
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#2f4b79]">
                      {g.nilai}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
