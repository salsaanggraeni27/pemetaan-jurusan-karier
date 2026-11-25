'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Printer, X } from 'lucide-react';
import { PillTabs } from '@/components/ui/pill-tabs';

export default function RekomendasiPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRumpun, setSelectedRumpun] = useState<string>('Semua');
  const [breakdownModalJurusan, setBreakdownModalJurusan] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sman1_user');
    if (saved === null) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(saved);
    setUser(parsed);

    fetch(`/api/siswa/rekomendasi?siswaId=${parsed.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-[#6e6e6e] text-sm">
        Menganalisis matriks rekomendasi program studi...
      </div>
    );
  }

  if (!data || !data.results || data.results.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-3">
        <h1 className="text-xl font-bold text-[#333333]">
          Belum Ada Data Rekomendasi
        </h1>
        <p className="text-sm text-[#6e6e6e]">
          Nilai rapor Anda belum diverifikasi oleh Guru BK SMAN 1 Bandung.
        </p>
        <Link
          href="/siswa"
          className="inline-flex h-9 items-center px-4 rounded-md bg-[#df6035] text-white text-sm font-medium"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const results = data.results;
  const filteredResults =
    selectedRumpun === 'Semua'
      ? results
      : results.filter((r: any) => r.jurusan.rumpun === selectedRumpun);

  const rumpunTabs = [
    { id: 'Semua', label: 'Semua' },
    { id: 'Saintek', label: 'Saintek' },
    { id: 'Soshum', label: 'Soshum' },
    { id: 'Campuran', label: 'Campuran' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#6e6e6e]">
            Rule-Based Matching · {user?.nama} ({user?.nisn_nip})
          </span>
          <h1 className="text-2xl font-bold text-[#333333] tracking-tight">
            Peringkat Rekomendasi Jurusan
          </h1>
        </div>

        <Link
          href="/siswa/cetak"
          className="inline-flex h-9 items-center gap-2 px-4 rounded-md bg-[#df6035] text-white text-sm font-medium hover:opacity-90 transition-opacity w-fit"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak A4</span>
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <PillTabs
          tabs={rumpunTabs}
          activeTab={selectedRumpun}
          onChange={setSelectedRumpun}
        />
        <span className="text-xs text-[#6e6e6e]">
          Menampilkan <strong className="font-mono text-[#333333]">{filteredResults.length}</strong> jurusan
        </span>
      </div>

      <div className="space-y-3">
        {filteredResults.map((item: any) => {
          const isTopOne = item.ranking === 1;

          return (
            <div
              key={item.jurusan.id_jurusan}
              className={`bg-white rounded-xl p-5 border transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isTopOne ? 'border-[#df6035]' : 'border-[#cccccc]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-lg font-mono flex items-center justify-center font-bold text-sm shrink-0 ${
                    isTopOne
                      ? 'bg-[#df6035] text-white'
                      : 'bg-[#e8ebed] text-[#333333]'
                  }`}
                >
                  #{item.ranking}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-[#333333]">
                      {item.jurusan.nama_jurusan}
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#e8ebed] text-[#2f4b79] font-medium">
                      {item.jurusan.rumpun}
                    </span>
                    <span className="text-xs text-[#6e6e6e]">
                      {item.peluangStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#6e6e6e]">
                    {item.jurusan.fakultas} · Passing Grade Indikatif{' '}
                    <span className="font-mono text-[#333333]">
                      {item.jurusan.passing_grade_indikatif}%
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5 pl-14 sm:pl-0">
                <div className="text-right">
                  <div
                    className={`font-mono text-xl font-bold tabular-nums ${
                      isTopOne ? 'text-[#df6035]' : 'text-[#2f4b79]'
                    }`}
                  >
                    {item.normalizedScore}%
                  </div>
                  <div className="text-[11px] text-[#6e6e6e]">Kecocokan</div>
                </div>

                <button
                  type="button"
                  onClick={() => setBreakdownModalJurusan(item)}
                  className="px-3 py-1.5 rounded-md border border-[#cccccc] bg-[#f4f5f7] hover:bg-[#e8ebed] text-xs font-medium text-[#333333] cursor-pointer transition-colors"
                >
                  Rincian Bobot
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {breakdownModalJurusan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 border border-[#cccccc] shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#cccccc]">
              <div>
                <span className="text-xs text-[#6e6e6e]">
                  Rincian Perhitungan Rule-Based Matching
                </span>
                <h2 className="text-lg font-bold text-[#333333]">
                  {breakdownModalJurusan.jurusan.nama_jurusan}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setBreakdownModalJurusan(null)}
                className="w-8 h-8 rounded-md bg-[#f4f5f7] hover:bg-[#e8ebed] text-[#333333] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#f4f5f7] border border-[#cccccc] text-xs font-mono text-[#2f4b79]">
              Total Skor = Σ (Nilai Siswa × Bobot) / Σ Bobot ={' '}
              <strong>{breakdownModalJurusan.normalizedScore}%</strong>
            </div>

            <div className="overflow-x-auto border border-[#cccccc] rounded-lg">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4f5f7] text-[#6e6e6e] border-b border-[#cccccc]">
                    <th className="py-2.5 px-3 font-medium">Mata Pelajaran</th>
                    <th className="py-2.5 px-3 text-center font-medium">Nilai</th>
                    <th className="py-2.5 px-3 text-center font-medium">Bobot</th>
                    <th className="py-2.5 px-3 text-right font-medium">Kontribusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cccccc]/60">
                  {breakdownModalJurusan.breakdown.map((row: any) => (
                    <tr key={row.mapelId}>
                      <td className="py-2.5 px-3 font-medium text-[#333333]">
                        {row.namaMapel}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        {row.nilaiSiswa}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-[#6e6e6e]">
                        {row.bobot}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#df6035]">
                        +{row.kontribusiSkor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
