'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CetakRekomendasiPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sman1_user');
    if (!saved) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(saved);
    setUser(parsed);

    Promise.all([
      fetch(`/api/siswa/rekomendasi?siswaId=${parsed.id}`).then(res => res.json()),
      fetch(`/api/siswa/nilai?siswaId=${parsed.id}`).then(res => res.json()),
      fetch('/api/mapel').then(res => res.json())
    ]).then(([recRes, nilaiRes, mapelRes]) => {
      if (recRes.success) setData(recRes.data);
      if (nilaiRes.success) setGrades(nilaiRes.data);
      if (mapelRes.success) setMapelList(mapelRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-16 text-center text-slate-500">Menyiapkan dokumen lembar rekomendasi resmi...</div>;
  }

  const topThree = data?.results?.slice(0, 3) || [];
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Action Bar (Hidden when printed) */}
      <div className="flex items-center justify-between no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <Link
          href="/siswa/rekomendasi"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Ringkasan
        </Link>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Cetak Lembar Dokumen / Simpan PDF
        </button>
      </div>

      {/* Printable Sheet (Standard A4 paper look) */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-300 shadow-lg text-slate-900 space-y-6 print:border-0 print:shadow-none print:p-0">
        
        {/* Official SMAN 1 Bandung Header */}
        <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
          <div className="text-xs font-bold tracking-widest uppercase text-slate-700">
            Pemerintah Daerah Provinsi Jawa Barat • Dinas Pendidikan
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
            SMA Negeri 1 Bandung
          </h1>
          <div className="text-xs text-slate-600">
            Unit Layanan Bimbingan dan Konseling (BK) • Jl. Ir. H. Juanda No. 93, Kota Bandung, Jawa Barat
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Laman: www.sman1bdg.sch.id • Surel: bk@sman1bdg.sch.id
          </div>
        </div>

        {/* Title of Document */}
        <div className="text-center space-y-1 pt-2">
          <h2 className="text-base font-extrabold uppercase tracking-wider underline">
            Lembar Hasil Pemetaan Jurusan Perguruan Tinggi &amp; Karir
          </h2>
          <p className="text-xs text-slate-500">
            Nomor Dokumen: BK-SMAN1/MAP-JUR/{new Date().getFullYear()}/{user?.nisn_nip || '0000'}
          </p>
        </div>

        {/* Student Biodata */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-3">
          <div>
            <span className="text-slate-500 block">Nama Lengkap Siswa:</span>
            <strong className="text-slate-900 text-sm">{user?.nama}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Nomor Induk Siswa Nasional (NISN):</span>
            <strong className="text-slate-900 text-sm">{user?.nisn_nip}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Kelas / Tingkat:</span>
            <strong className="text-slate-900">{user?.kelas || 'XII'}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Metode Evaluasi Akademik:</span>
            <strong className="text-blue-700 font-bold">Rule-Based Matching (Matriks Bobot BK)</strong>
          </div>
        </div>

        {/* Table of Top Recommendations */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            A. Rekomendasi Program Studi Perguruan Tinggi (Berdasarkan Nilai Rapor)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 py-2 px-3 text-center w-12">Rank</th>
                  <th className="border border-slate-300 py-2 px-3">Program Studi &amp; Rumpun</th>
                  <th className="border border-slate-300 py-2 px-3 text-center">Skor Kecocokan</th>
                  <th className="border border-slate-300 py-2 px-3 text-center">Passing Grade</th>
                  <th className="border border-slate-300 py-2 px-3 text-center">Status Kelayakan</th>
                </tr>
              </thead>
              <tbody>
                {topThree.map((item: any) => (
                  <tr key={item.jurusan.id_jurusan} className="border-b border-slate-300">
                    <td className="border border-slate-300 py-2.5 px-3 text-center font-bold">#{item.ranking}</td>
                    <td className="border border-slate-300 py-2.5 px-3">
                      <div className="font-bold text-slate-900">{item.jurusan.nama_jurusan}</div>
                      <div className="text-[10px] text-slate-500">Rumpun {item.jurusan.rumpun} • {item.jurusan.fakultas}</div>
                    </td>
                    <td className="border border-slate-300 py-2.5 px-3 text-center font-black text-blue-700 text-sm">
                      {item.normalizedScore}%
                    </td>
                    <td className="border border-slate-300 py-2.5 px-3 text-center font-semibold text-slate-700">
                      {item.jurusan.passing_grade_indikatif}%
                    </td>
                    <td className="border border-slate-300 py-2.5 px-3 text-center font-bold text-slate-800">
                      {item.peluangStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section B: Linked Careers */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            B. Rekomendasi Prospek Karir Masa Depan yang Selaras
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {topThree[0]?.linkedCareer?.karirList?.map((karir: any) => (
              <div key={karir.id_karir} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="font-bold text-slate-900">{karir.profesi}</div>
                <div className="text-[10px] text-slate-500">Bidang: {karir.industri} • Prospek: {karir.prospek_masa_depan}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Estimasi Gaji: {karir.estimasi_gaji}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Counselor Guidance Note */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
          <span className="font-bold text-slate-800 block">Catatan &amp; Arahan Guru BK SMAN 1 Bandung:</span>
          <p className="text-slate-600 leading-relaxed italic">
            "Siswa menunjukkan konsistensi capaian akademik yang sangat baik pada mata pelajaran pendukung jurusan peringkat #1. Disarankan untuk memantau daya tampung SNBP/SNBT pada universitas tujuan dan terus menjaga stabilitas nilai semester akhir."
          </p>
        </div>

        {/* Signatures */}
        <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center">
          <div>
            <p className="text-slate-500 mb-16">Siswa Yang Bersangkutan,</p>
            <p className="font-bold text-slate-900 uppercase underline">{user?.nama}</p>
            <p className="text-slate-500">NISN. {user?.nisn_nip}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-16">Bandung, {currentDate}<br />Koordinator Guru Bimbingan &amp; Konseling,</p>
            <p className="font-bold text-slate-900 uppercase underline">Dra. Hj. Ratna Juwita, M.Pd</p>
            <p className="text-slate-500">NIP. 19780512 200212 2 001</p>
          </div>
        </div>

      </div>

    </div>
  );
}

