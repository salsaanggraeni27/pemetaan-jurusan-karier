'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';

export default function CetakRekomendasiPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      .then((recRes) => {
        if (recRes.success) setData(recRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-[#6e6e6e] text-sm">
        Menyiapkan dokumen lembar rekomendasi resmi...
      </div>
    );
  }

  const topThree = data?.results?.slice(0, 3) || [];
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
      <div className="flex items-center justify-between no-print bg-white border border-[#cccccc] rounded-xl p-3.5 shadow-sm">
        <Link
          href="/siswa/rekomendasi"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#333333] hover:text-[#df6035]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Rekomendasi</span>
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-9 items-center gap-2 px-4 rounded-md bg-[#df6035] text-white text-xs font-medium hover:opacity-90 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      <div className="bg-white border border-[#cccccc] rounded-xl p-8 sm:p-10 text-[#333333] space-y-6 shadow-sm print:border-0 print:shadow-none print:p-0">
        <div className="border-b-2 border-[#333333] pb-4 text-center space-y-1">
          <div className="text-xs font-semibold text-[#6e6e6e]">
            Pemerintah Daerah Provinsi Jawa Barat — Dinas Pendidikan
          </div>
          <h1 className="text-xl font-bold text-[#333333]">
            SMA Negeri 1 Bandung
          </h1>
          <div className="text-xs text-[#6e6e6e]">
            Unit Layanan Bimbingan dan Konseling — Jalan Ir. H. Juanda, Coblong, Kota Bandung
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-base font-bold text-[#333333] underline">
            Lembar Hasil Pemetaan Jurusan Perguruan Tinggi dan Karir
          </h2>
          <p className="font-mono text-xs text-[#6e6e6e]">
            Nomor: BK-SMAN1/{new Date().getFullYear()}/{user?.nisn_nip || '0000'}
          </p>
        </div>

        <div className="bg-[#f4f5f7] p-4 rounded-lg border border-[#cccccc] text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <span className="text-[#6e6e6e] block">Nama Siswa</span>
            <strong className="text-[#333333]">{user?.nama}</strong>
          </div>
          <div>
            <span className="text-[#6e6e6e] block">NISN</span>
            <strong className="font-mono text-[#333333]">{user?.nisn_nip}</strong>
          </div>
          <div>
            <span className="text-[#6e6e6e] block">Kelas</span>
            <strong className="text-[#333333]">{user?.kelas || 'XII'}</strong>
          </div>
          <div>
            <span className="text-[#6e6e6e] block">Metode</span>
            <strong className="text-[#2f4b79]">Rule-Based Matching</strong>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#333333] uppercase tracking-wider">
            3 Rekomendasi Program Studi Utama
          </h3>
          <table className="w-full text-xs text-left border border-[#cccccc] border-collapse">
            <thead>
              <tr className="bg-[#f4f5f7] text-[#333333]">
                <th className="border border-[#cccccc] py-2 px-3 text-center w-12">Rank</th>
                <th className="border border-[#cccccc] py-2 px-3">Program Studi &amp; Rumpun</th>
                <th className="border border-[#cccccc] py-2 px-3 text-center">Skor</th>
                <th className="border border-[#cccccc] py-2 px-3 text-center">Passing Grade</th>
                <th className="border border-[#cccccc] py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {topThree.map((item: any) => (
                <tr key={item.jurusan.id_jurusan} className="border-b border-[#cccccc]">
                  <td className="border border-[#cccccc] py-2.5 px-3 text-center font-mono font-bold">
                    #{item.ranking}
                  </td>
                  <td className="border border-[#cccccc] py-2.5 px-3">
                    <div className="font-bold text-[#333333]">{item.jurusan.nama_jurusan}</div>
                    <div className="text-[11px] text-[#6e6e6e]">
                      {item.jurusan.rumpun} — {item.jurusan.fakultas}
                    </div>
                  </td>
                  <td className="border border-[#cccccc] py-2.5 px-3 text-center font-mono font-bold text-[#df6035]">
                    {item.normalizedScore}%
                  </td>
                  <td className="border border-[#cccccc] py-2.5 px-3 text-center font-mono">
                    {item.jurusan.passing_grade_indikatif}%
                  </td>
                  <td className="border border-[#cccccc] py-2.5 px-3 text-center font-medium">
                    {item.peluangStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center">
          <div>
            <p className="text-[#6e6e6e] mb-14">Siswa yang bersangkutan,</p>
            <p className="font-bold text-[#333333] underline">{user?.nama}</p>
            <p className="font-mono text-[11px] text-[#6e6e6e]">NISN {user?.nisn_nip}</p>
          </div>
          <div>
            <p className="text-[#6e6e6e] mb-14">
              Bandung, {currentDate}
              <br />
              Koordinator Guru BK,
            </p>
            <p className="font-bold text-[#333333] underline">Dra. Hj. Ratna Juwita, M.Pd</p>
            <p className="font-mono text-[11px] text-[#6e6e6e]">NIP 19780512 200212 2 001</p>
          </div>
        </div>
      </div>
    </div>
  );
}
