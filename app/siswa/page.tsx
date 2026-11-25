'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PillTabs } from '@/components/ui/pill-tabs';
import {
  Briefcase,
  BookOpen,
  Edit3,
  Printer,
  X,
  AlertCircle,
} from 'lucide-react';

export default function SiswaDashboardPage() {
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
    if (parsed.role === 'GURU_BK') {
      router.push('/admin');
      return;
    }
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
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-[#5c5f5b] text-sm">
        Memuat hasil pemetaan jurusan dan karir Anda...
      </div>
    );
  }

  const results = data?.results || [];
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
    <div className="max-w-6xl mx-auto px-5 sm:px-7 py-10 space-y-7">
      {/* Header Siswa */}
      <div className="cairn-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="cairn-kicker">
            NIS {user?.nisn_nip} · Kelas {user?.kelas || 'XII'}
          </span>
          <h1 className="font-serif-cairn text-3xl sm:text-4xl text-[#111211]">
            Hasil pemetaan {user?.nama}.
          </h1>
          <p className="text-xs text-[#5c5f5b]">
            Rekomendasi jurusan dan prospek karir dihitung otomatis dari rata-rata nilai rapor per semester Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/siswa/input-nilai" className="cairn-pill">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Kelola Nilai per Semester</span>
          </Link>
          {results.length > 0 && (
            <Link href="/siswa/cetak" className="cairn-pill-soft">
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak A4</span>
            </Link>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="cairn-card p-10 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#f1f1ef] text-[#e4572e] flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="font-serif-cairn text-2xl text-[#111211]">
            Belum ada nilai rapor yang diinput.
          </h2>
          <p className="text-xs text-[#5c5f5b] max-w-md mx-auto">
            Silakan isi nilai rapor semester Anda terlebih dahulu agar sistem dapat memetakan jurusan kuliah dan prospek karir yang paling sesuai.
          </p>
          <Link href="/siswa/input-nilai" className="cairn-pill">
            Input Nilai Semester Sekarang
          </Link>
        </div>
      ) : (
        <>
          {/* Filter & Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <PillTabs
              tabs={rumpunTabs}
              activeTab={selectedRumpun}
              onChange={setSelectedRumpun}
            />
            <div className="font-mono-cairn text-xs text-[#5c5f5b]">
              Rata-rata Rapor:{' '}
              <strong className="text-[#111211]">
                {data.rataRataNilaiKeseluruhan}
              </strong>{' '}
              ({data.totalMapelDinilai} mapel)
            </div>
          </div>

          {/* Combined Jurusan + Karir Mapping List */}
          <div className="space-y-3.5">
            {filteredResults.map((item: any) => {
              const isTopOne = item.ranking === 1;
              const karirList = item.linkedCareer?.karirList || [];

              return (
                <div
                  key={item.jurusan.id_jurusan}
                  className={`cairn-card p-6 space-y-4 ${
                    isTopOne ? 'ring-1 ring-[#e4572e]' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-11 h-11 rounded-full font-mono-cairn flex items-center justify-center font-semibold text-sm shrink-0 ${
                          isTopOne
                            ? 'bg-[#111211] text-[#f7f7f5]'
                            : 'bg-[#f1f1ef] text-[#111211]'
                        }`}
                      >
                        #{item.ranking}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-serif-cairn text-2xl text-[#111211]">
                            {item.jurusan.nama_jurusan}
                          </h2>
                          <span className="font-mono-cairn text-[10.5px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f1f1ef] text-[#111211]">
                            {item.jurusan.rumpun}
                          </span>
                          <span className="text-xs text-[#5c5f5b]">
                            {item.peluangStatus}
                          </span>
                        </div>
                        <p className="text-xs text-[#686b67]">
                          {item.jurusan.fakultas} · Passing Grade{' '}
                          <span className="font-mono-cairn text-[#111211]">
                            {item.jurusan.passing_grade_indikatif}%
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 pl-14 sm:pl-0">
                      <div className="text-right">
                        <div
                          className={`font-serif-cairn text-3xl leading-none tabular-nums ${
                            isTopOne ? 'text-[#e4572e]' : 'text-[#111211]'
                          }`}
                        >
                          {item.normalizedScore}%
                        </div>
                        <div className="font-mono-cairn text-[10px] uppercase tracking-wider text-[#686b67] mt-1">
                          Kecocokan
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setBreakdownModalJurusan(item)}
                        className="cairn-pill-soft !h-8 !px-3.5 !text-xs cursor-pointer"
                      >
                        Rincian Nilai
                      </button>
                    </div>
                  </div>

                  {/* Mapel Pendukung & Prospek Karir */}
                  <div className="pt-3.5 border-t border-black/10 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#2a6ee0] shrink-0" />
                      <span className="text-[#686b67] font-medium">Mapel:</span>
                      {item.breakdown.slice(0, 4).map((b: any) => (
                        <span
                          key={b.mapelId}
                          className="px-2.5 py-0.5 rounded-full bg-[#f1f1ef] text-[11px] text-[#151615]"
                        >
                          {b.namaMapel}{' '}
                          <strong className="font-mono-cairn text-[#2a6ee0]">
                            {b.nilaiSiswa}
                          </strong>
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#e4572e] shrink-0" />
                      <span className="text-[#686b67] font-medium">
                        Prospek Karir:
                      </span>
                      {karirList.length > 0 ? (
                        karirList.map((k: any) => (
                          <span
                            key={k.id_karir}
                            className="px-2.5 py-0.5 rounded-full bg-[#111211] text-[#f7f7f5] text-[11px] font-medium"
                            title={`${k.industri} · ${k.estimasi_gaji}`}
                          >
                            {k.profesi}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#686b67]">-</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Breakdown Modal */}
      {breakdownModalJurusan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="cairn-card max-w-xl w-full p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-black/10">
              <div>
                <span className="cairn-kicker">Rincian Perhitungan</span>
                <h2 className="font-serif-cairn text-3xl text-[#111211] mt-1">
                  {breakdownModalJurusan.jurusan.nama_jurusan}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setBreakdownModalJurusan(null)}
                className="w-8 h-8 rounded-full bg-[#f1f1ef] text-[#111211] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto border border-black/10 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#f1f1ef] text-[#686b67] border-b border-black/10 font-mono-cairn text-[10.5px] uppercase">
                    <th className="py-2.5 px-3">Mata Pelajaran</th>
                    <th className="py-2.5 px-3 text-center">Nilai Rapor</th>
                    <th className="py-2.5 px-3 text-center">Bobot</th>
                    <th className="py-2.5 px-3 text-right">Kontribusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {breakdownModalJurusan.breakdown.map((row: any) => (
                    <tr key={row.mapelId}>
                      <td className="py-2.5 px-3 font-medium text-[#151615]">
                        {row.namaMapel}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono-cairn">
                        {row.nilaiSiswa}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono-cairn text-[#686b67]">
                        {row.bobot}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-cairn font-semibold text-[#e4572e]">
                        +{row.kontribusiSkor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {breakdownModalJurusan.linkedCareer?.karirList?.length > 0 && (
              <div className="space-y-2 pt-1">
                <h3 className="font-mono-cairn text-[10.5px] uppercase tracking-wider text-[#686b67]">
                  Prospek Karir &amp; Estimasi Gaji
                </h3>
                <div className="space-y-1.5">
                  {breakdownModalJurusan.linkedCareer.karirList.map(
                    (k: any) => (
                      <div
                        key={k.id_karir}
                        className="p-3 rounded-xl bg-[#f1f1ef] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-[#151615]">
                            {k.profesi}
                          </div>
                          <div className="text-[11px] text-[#686b67]">
                            {k.industri}
                          </div>
                        </div>
                        <span className="font-mono-cairn font-medium text-[#2a6ee0]">
                          {k.estimasi_gaji}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
