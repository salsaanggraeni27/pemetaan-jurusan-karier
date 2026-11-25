'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Save,
  Trash2,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { PillTabs } from '@/components/ui/pill-tabs';

export default function AdminInputNilaiPage() {
  const searchParams = useSearchParams();
  const preselectedSiswaId = searchParams.get('siswaId');

  const [siswaList, setSiswaList] = useState<any[]>([]);
  const [selectedSiswaId, setSelectedSiswaId] = useState<number | null>(null);
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [activeSemester, setActiveSemester] = useState<string>('1');
  const [grades, setGrades] = useState<{ [mapelId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then((res) => res.json()),
      fetch('/api/mapel').then((res) => res.json()),
    ])
      .then(([statsRes, mapelRes]) => {
        if (statsRes.success && statsRes.data?.siswaList) {
          const list = statsRes.data.siswaList.map((item: any) => item.siswa);
          setSiswaList(list);

          if (preselectedSiswaId) {
            setSelectedSiswaId(parseInt(preselectedSiswaId));
          } else if (list.length > 0) {
            setSelectedSiswaId(list[0].id);
          }
        }
        if (mapelRes.success) {
          setMapelList(mapelRes.data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [preselectedSiswaId]);

  const loadGrades = (sId: number, sem: string) => {
    setLoading(true);
    fetch(`/api/siswa/nilai?siswaId=${sId}&semester=${sem}`)
      .then((res) => res.json())
      .then((res) => {
        const gradesMap: { [id: number]: number } = {};
        if (res.success && Array.isArray(res.data)) {
          res.data.forEach((n: any) => {
            gradesMap[n.id_mapel] = n.nilai;
          });
        }
        setGrades(gradesMap);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!selectedSiswaId) return;
    setFeedback(null);
    loadGrades(selectedSiswaId, activeSemester);
  }, [selectedSiswaId, activeSemester]);

  const handleGradeChange = (mapelId: number, val: string) => {
    if (val === '') {
      const next = { ...grades };
      delete next[mapelId];
      setGrades(next);
      return;
    }
    let numeric = Number(val);
    if (isNaN(numeric) || numeric < 0) numeric = 0;
    if (numeric > 100) numeric = 100;
    setGrades((prev) => ({ ...prev, [mapelId]: numeric }));
  };

  const handlePreset = (
    type: 'MIPA_TECH' | 'MIPA_MED' | 'IPS_SOSHUM' | 'BALANCED'
  ) => {
    const presetMap: { [id: number]: number } = {};
    mapelList.forEach((m) => {
      let g = 82;
      if (type === 'MIPA_TECH') {
        if (m.nama_mapel.includes('Informatika')) g = 96;
        else if (m.nama_mapel.includes('Lanjut')) g = 94;
        else if (m.nama_mapel.includes('Fisika')) g = 91;
        else if (m.nama_mapel.includes('Inggris')) g = 90;
        else if (m.nama_mapel.includes('Umum')) g = 88;
        else if (m.kategori === 'Peminatan IPS') g = 78;
      } else if (type === 'MIPA_MED') {
        if (m.nama_mapel.includes('Biologi')) g = 97;
        else if (m.nama_mapel.includes('Kimia')) g = 95;
        else if (m.nama_mapel.includes('Inggris')) g = 90;
        else if (m.nama_mapel.includes('Indonesia')) g = 88;
        else if (m.nama_mapel.includes('Umum')) g = 86;
        else if (m.kategori === 'Peminatan IPS') g = 79;
      } else if (type === 'IPS_SOSHUM') {
        if (m.nama_mapel.includes('Ekonomi')) g = 96;
        else if (m.nama_mapel.includes('Sosiologi')) g = 95;
        else if (m.nama_mapel.includes('Indonesia')) g = 93;
        else if (m.nama_mapel.includes('Pancasila')) g = 92;
        else if (m.nama_mapel.includes('Geografi')) g = 90;
        else if (m.kategori === 'Peminatan MIPA') g = 74;
      } else {
        g = 85;
      }
      presetMap[m.id_mapel] = g;
    });
    setGrades(presetMap);
    setFeedback({
      type: 'success',
      message: `Preset nilai diterapkan ke Semester ${activeSemester}. Klik Simpan untuk memperbarui data.`,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswaId) return;
    setSaving(true);
    setFeedback(null);

    const payload = Object.entries(grades)
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
          siswaId: selectedSiswaId,
          semester: parseInt(activeSemester),
          nilaiList: payload,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({
          type: 'success',
          message: `Nilai Semester ${activeSemester} berhasil disimpan dan rekomendasi diperbarui.`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Gagal menyimpan nilai siswa.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Terjadi kesalahan server saat menyimpan nilai.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMapelGrade = async (mapelId: number) => {
    if (!selectedSiswaId) return;
    const next = { ...grades };
    delete next[mapelId];
    setGrades(next);

    await fetch(
      `/api/siswa/nilai?siswaId=${selectedSiswaId}&semester=${activeSemester}&mapelId=${mapelId}`,
      { method: 'DELETE' }
    );
    setFeedback({
      type: 'success',
      message: `Nilai mata pelajaran dihapus dari Semester ${activeSemester}.`,
    });
  };

  const handleDeleteAllSemester = async () => {
    if (!selectedSiswaId) return;
    if (
      !confirm(`Hapus seluruh nilai siswa ini pada Semester ${activeSemester}?`)
    )
      return;

    await fetch(
      `/api/siswa/nilai?siswaId=${selectedSiswaId}&semester=${activeSemester}`,
      { method: 'DELETE' }
    );
    setGrades({});
    setFeedback({
      type: 'success',
      message: `Seluruh nilai Semester ${activeSemester} siswa ini telah dihapus.`,
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

  const gradeValues = Object.values(grades).filter((v) => v > 0);
  const avgGrade =
    gradeValues.length > 0
      ? (gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(1)
      : '0';

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-7 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="cairn-kicker">
            Manajemen Akademik Admin · SMAN 1 Bandung
          </span>
          <h1 className="font-serif-cairn text-4xl text-[#111211]">
            CRUD nilai siswa per semester.
          </h1>
        </div>

        <div className="cairn-card px-4 py-2.5 flex items-center gap-4">
          <div>
            <span className="font-mono-cairn text-[10px] uppercase tracking-wider text-[#686b67] block">
              Rata-rata Sem {activeSemester}
            </span>
            <span className="font-mono-cairn text-sm font-semibold text-[#e4572e]">
              {avgGrade} ({gradeValues.length} mapel)
            </span>
          </div>
        </div>
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

      {/* Pilih Siswa & Preset */}
      <div className="cairn-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label
              htmlFor="select-siswa"
              className="font-mono-cairn text-[10.5px] uppercase tracking-wider text-[#686b67] block mb-1.5"
            >
              Pilih Siswa
            </label>
            <select
              id="select-siswa"
              value={selectedSiswaId || ''}
              onChange={(e) => setSelectedSiswaId(parseInt(e.target.value))}
              className="h-10 w-full px-3.5 rounded-xl border border-black/10 text-sm font-medium text-[#151615] bg-[#f1f1ef] cursor-pointer"
            >
              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.kelas || 'XII'}) — NIS {s.nisn_nip}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2 sm:pt-5">
            <button
              type="button"
              onClick={() => handlePreset('MIPA_TECH')}
              className="cairn-pill-soft !h-8 !px-3 !text-xs cursor-pointer"
            >
              Preset MIPA-TI
            </button>
            <button
              type="button"
              onClick={() => handlePreset('MIPA_MED')}
              className="cairn-pill-soft !h-8 !px-3 !text-xs cursor-pointer"
            >
              Preset MIPA-Medis
            </button>
            <button
              type="button"
              onClick={() => handlePreset('IPS_SOSHUM')}
              className="cairn-pill-soft !h-8 !px-3 !text-xs cursor-pointer"
            >
              Preset Soshum
            </button>
            <button
              type="button"
              onClick={() => handlePreset('BALANCED')}
              className="cairn-pill-soft !h-8 !px-3 !text-xs cursor-pointer"
            >
              Rata 85
            </button>
          </div>
        </div>
      </div>

      {/* Semester Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PillTabs
          tabs={semesterTabs}
          activeTab={activeSemester}
          onChange={setActiveSemester}
        />

        <button
          type="button"
          onClick={handleDeleteAllSemester}
          className="cairn-pill-soft !h-8 !px-3.5 !text-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Hapus Semester {activeSemester}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="cairn-card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#5c5f5b]">
              Memuat nilai...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#f1f1ef] text-[#686b67] border-b border-black/10 font-mono-cairn text-[10.5px] uppercase tracking-wider">
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-center w-36">
                    Nilai Sem {activeSemester}
                  </th>
                  <th className="py-3 px-4 text-right w-20">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {mapelList.map((mapel) => {
                  const currentVal = grades[mapel.id_mapel] ?? '';
                  const hasVal = currentVal !== '' && Number(currentVal) > 0;
                  return (
                    <tr
                      key={mapel.id_mapel}
                      className="hover:bg-[#f1f1ef]/60"
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
                          value={currentVal}
                          onChange={(e) =>
                            handleGradeChange(mapel.id_mapel, e.target.value)
                          }
                          className="w-24 h-8 text-center font-mono-cairn font-semibold text-[#111211] bg-[#f1f1ef] border border-black/10 rounded-lg text-xs tabular-nums"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {hasVal && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteMapelGrade(mapel.id_mapel)
                            }
                            className="p-1.5 rounded-lg text-[#686b67] hover:text-[#e4572e] hover:bg-[#f1f1ef] cursor-pointer"
                            title="Hapus nilai mapel ini"
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
