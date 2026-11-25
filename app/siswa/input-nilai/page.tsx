'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PillTabs } from '@/components/ui/pill-tabs';
import {
  Save,
  Trash2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface MapelItem {
  id_mapel: number;
  nama_mapel: string;
  kategori: string;
}

export default function SiswaCrudNilaiSemesterPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mapelList, setMapelList] = useState<MapelItem[]>([]);
  const [activeSemester, setActiveSemester] = useState<string>('1');
  const [semesterGrades, setSemesterGrades] = useState<{
    [mapelId: number]: number;
  }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadSemesterGrades = (siswaId: number, sem: string) => {
    setLoading(true);
    fetch(`/api/siswa/nilai?siswaId=${siswaId}&semester=${sem}`)
      .then((res) => res.json())
      .then((nilaiRes) => {
        const map: { [id: number]: number } = {};
        if (nilaiRes.success && Array.isArray(nilaiRes.data)) {
          nilaiRes.data.forEach((n: any) => {
            map[n.id_mapel] = n.nilai;
          });
        }
        setSemesterGrades(map);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const saved = localStorage.getItem('sman1_user');
    if (saved === null) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(saved);
    if (parsed.role === 'GURU_BK') {
      router.push('/admin/input-nilai');
      return;
    }
    setUser(parsed);

    fetch('/api/mapel')
      .then((res) => res.json())
      .then((mapelRes) => {
        if (mapelRes.success) {
          setMapelList(mapelRes.data || []);
        }
        loadSemesterGrades(parsed.id, '1');
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const handleSemesterChange = (sem: string) => {
    setActiveSemester(sem);
    setFeedback(null);
    if (user) {
      loadSemesterGrades(user.id, sem);
    }
  };

  const handleGradeChange = (mapelId: number, val: string) => {
    if (val === '') {
      const next = { ...semesterGrades };
      delete next[mapelId];
      setSemesterGrades(next);
      return;
    }
    let numeric = Number(val);
    if (isNaN(numeric) || numeric < 0) numeric = 0;
    if (numeric > 100) numeric = 100;
    setSemesterGrades((prev) => ({ ...prev, [mapelId]: numeric }));
  };

  const handleSaveSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setFeedback(null);

    const payload = Object.entries(semesterGrades)
      .filter(([_, nilai]) => Number(nilai) > 0)
      .map(([mapelId, nilai]) => ({
        id_mapel: parseInt(mapelId),
        semester: parseInt(activeSemester),
        nilai: Number(nilai),
      }));

    try {
      const res = await fetch('/api/siswa/nilai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siswaId: user.id,
          semester: parseInt(activeSemester),
          nilaiList: payload,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: `Nilai Semester ${activeSemester} berhasil disimpan dan hasil pemetaan jurusan/karir diperbarui.`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Gagal menyimpan nilai.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Terjadi kesalahan jaringan saat menyimpan.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSingleMapel = async (mapelId: number) => {
    if (!user) return;
    const next = { ...semesterGrades };
    delete next[mapelId];
    setSemesterGrades(next);

    await fetch(
      `/api/siswa/nilai?siswaId=${user.id}&semester=${activeSemester}&mapelId=${mapelId}`,
      { method: 'DELETE' }
    );
    setFeedback({
      type: 'success',
      message: `Nilai mata pelajaran pada Semester ${activeSemester} dihapus.`,
    });
  };

  const handleResetSemester = async () => {
    if (!user) return;
    if (!confirm(`Hapus seluruh nilai pada Semester ${activeSemester}?`))
      return;

    await fetch(
      `/api/siswa/nilai?siswaId=${user.id}&semester=${activeSemester}`,
      { method: 'DELETE' }
    );
    setSemesterGrades({});
    setFeedback({
      type: 'success',
      message: `Seluruh nilai Semester ${activeSemester} telah dikosongkan.`,
    });
  };

  const semesterTabs = [
    { id: '1', label: 'Semester 1' },
    { id: '2', label: 'Semester 2' },
    { id: '3', label: 'Semester 3' },
    { id: '4', label: 'Semester 4' },
    { id: '5', label: 'Semester 5' },
    { id: '6', label: 'Semester 6' },
  ];

  const filledValues = Object.values(semesterGrades).filter((v) => v > 0);
  const avgSemester =
    filledValues.length > 0
      ? (filledValues.reduce((a, b) => a + b, 0) / filledValues.length).toFixed(
          1
        )
      : '0';

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-7 py-10 space-y-6">
      {/* Header */}
      <div className="cairn-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="cairn-kicker">
            Input &amp; Edit Nilai Mandiri · NIS {user?.nisn_nip}
          </span>
          <h1 className="font-serif-cairn text-3xl sm:text-4xl text-[#111211]">
            Kelola nilai rapor per semester.
          </h1>
          <p className="text-xs text-[#5c5f5b]">
            Isi, ubah, atau hapus nilai rapor Anda untuk Semester 1 s/d 6.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#f1f1ef] rounded-xl px-4 py-2 text-right">
            <span className="font-mono-cairn text-[10px] uppercase tracking-wider text-[#686b67] block">
              Rata-rata Sem {activeSemester}
            </span>
            <span className="font-mono-cairn text-sm font-semibold text-[#e4572e]">
              {avgSemester} ({filledValues.length}/{mapelList.length})
            </span>
          </div>
          <Link href="/siswa" className="cairn-pill">
            <span>Hasil Mapping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Semester Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PillTabs
          tabs={semesterTabs}
          activeTab={activeSemester}
          onChange={handleSemesterChange}
        />

        <button
          type="button"
          onClick={handleResetSemester}
          className="cairn-pill-soft !h-8 !px-3.5 !text-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kosongkan Semester {activeSemester}</span>
        </button>
      </div>

      {feedback && (
        <div
          role="status"
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-700" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* CRUD Table Form */}
      <form onSubmit={handleSaveSemester} className="space-y-4">
        <div className="cairn-card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#5c5f5b]">
              Memuat nilai Semester {activeSemester}...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#f1f1ef] text-[#686b67] border-b border-black/10 font-mono-cairn text-[10.5px] uppercase tracking-wider">
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-center w-40">
                    Nilai Semester {activeSemester}
                  </th>
                  <th className="py-3 px-4 text-right w-20">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {mapelList.map((mapel) => {
                  const val = semesterGrades[mapel.id_mapel] ?? '';
                  const hasVal = val !== '' && Number(val) > 0;

                  return (
                    <tr
                      key={mapel.id_mapel}
                      className="hover:bg-[#f1f1ef]/60 transition-colors"
                    >
                      <td className="py-2.5 px-4 font-medium text-[#151615]">
                        {mapel.nama_mapel}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-[#686b67]">
                        {mapel.kategori}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0 - 100"
                          value={val}
                          onChange={(e) =>
                            handleGradeChange(mapel.id_mapel, e.target.value)
                          }
                          className="w-24 h-8 text-center font-mono-cairn font-semibold text-[#111211] bg-[#f1f1ef] border border-black/10 rounded-lg text-xs focus:outline-none focus:border-[#2a6ee0]"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {hasVal && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteSingleMapel(mapel.id_mapel)
                            }
                            title="Hapus nilai mapel ini"
                            className="p-1.5 rounded-lg text-[#686b67] hover:text-[#e4572e] hover:bg-[#f1f1ef] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="cairn-pill !h-10 !px-6 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>
              {saving
                ? 'Menyimpan...'
                : `Simpan Nilai Semester ${activeSemester}`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
