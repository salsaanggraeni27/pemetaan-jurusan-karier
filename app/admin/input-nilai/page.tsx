'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FileEdit, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  BookOpen, 
  Calculator, 
  Sparkles, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export default function AdminInputNilaiPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSiswaId = searchParams.get('siswaId');

  const [siswaList, setSiswaList] = useState<any[]>([]);
  const [selectedSiswaId, setSelectedSiswaId] = useState<number | null>(null);
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [grades, setGrades] = useState<{ [mapelId: number]: number }>({});
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load Siswa list & Mapel
  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(res => res.json()),
      fetch('/api/mapel').then(res => res.json())
    ]).then(([statsRes, mapelRes]) => {
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
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [preselectedSiswaId]);

  // Load grades when selected student changes
  useEffect(() => {
    if (!selectedSiswaId) return;
    setLoading(true);
    setFeedback(null);

    fetch(`/api/siswa/nilai?siswaId=${selectedSiswaId}`)
      .then(res => res.json())
      .then(res => {
        const gradesMap: { [id: number]: number } = {};
        if (res.success && Array.isArray(res.data)) {
          res.data.forEach((n: any) => {
            gradesMap[n.id_mapel] = n.nilai;
          });
        }
        setGrades(gradesMap);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedSiswaId]);

  const handleGradeChange = (mapelId: number, val: string | number) => {
    let numeric = Number(val);
    if (isNaN(numeric) || numeric < 0) numeric = 0;
    if (numeric > 100) numeric = 100;
    setGrades(prev => ({ ...prev, [mapelId]: numeric }));
  };

  const handlePreset = (type: 'MIPA_TECH' | 'MIPA_MED' | 'IPS_SOSHUM' | 'BALANCED') => {
    const presetMap: { [id: number]: number } = {};
    mapelList.forEach(m => {
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
    setFeedback({ type: 'success', message: 'Template nilai berhasil diterapkan ke form!' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswaId) return;
    setSaving(true);
    setFeedback(null);

    const payload = Object.entries(grades).map(([mapelId, nilai]) => ({
      id_mapel: parseInt(mapelId),
      nilai: Number(nilai)
    }));

    try {
      const res = await fetch('/api/siswa/nilai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siswaId: selectedSiswaId,
          nilaiList: payload
        })
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({ 
          type: 'success', 
          message: 'Nilai rapor siswa berhasil disimpan & hasil rekomendasi Rule-Based otomatis diperbarui!' 
        });
      } else {
        setFeedback({ type: 'error', message: data.message || 'Gagal menyimpan nilai siswa.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan server saat menyimpan nilai.' });
    } finally {
      setSaving(false);
    }
  };

  const selectedSiswa = siswaList.find(s => s.id === selectedSiswaId);
  const categories = ['Semua', 'Wajib', 'Peminatan MIPA', 'Peminatan IPS', 'Peminatan Bahasa'];
  const filteredMapel = activeCategory === 'Semua' 
    ? mapelList 
    : mapelList.filter(m => m.kategori === activeCategory);

  const filledCount = Object.keys(grades).length;
  const gradeValues = Object.values(grades);
  const avgGrade = gradeValues.length > 0 
    ? (gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(1) 
    : '0';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-2">
            <FileEdit className="w-3.5 h-3.5" />
            Kewenangan Khusus Guru BK
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Input &amp; Verifikasi Nilai Rapor Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Guru BK bertugas menginputkan dan memverifikasi data nilai rapor siswa ke dalam sistem pemetaan.
          </p>
        </div>

        {/* Live average pill */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Mapel Diisi</span>
            <span className="font-extrabold text-slate-800 text-sm">{filledCount} / {mapelList.length}</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rata-Rata</span>
            <span className="font-extrabold text-indigo-600 text-sm">{avgGrade}</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Select Student Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
          Pilih Siswa yang Hendak Diinput / Diedit Nilainya:
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <select
              value={selectedSiswaId || ''}
              onChange={(e) => setSelectedSiswaId(parseInt(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {siswaList.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.kelas || 'Siswa'}) — NISN: {s.nisn_nip}
                </option>
              ))}
            </select>
          </div>

          {selectedSiswa && (
            <div className="bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-indigo-600 font-bold block">Status Siswa</span>
                <span className="font-extrabold text-indigo-950">{selectedSiswa.kelas}</span>
              </div>
              <span className="font-mono text-indigo-700 font-bold">{selectedSiswa.nisn_nip}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Template Presets for Guru BK */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Template Pengisian Cepat Guru BK:
          </span>
          <span className="text-[11px] text-indigo-700 font-medium">Bantu isi cepat sampel nilai:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => handlePreset('MIPA_TECH')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-100/80 text-indigo-900 border border-indigo-200 font-semibold transition"
          >
            💻 Pola Unggul Informatika &amp; MIPA
          </button>
          <button
            type="button"
            onClick={() => handlePreset('MIPA_MED')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-100/80 text-indigo-900 border border-indigo-200 font-semibold transition"
          >
            🩺 Pola Unggul Biologi &amp; Kimia (Kedokteran)
          </button>
          <button
            type="button"
            onClick={() => handlePreset('IPS_SOSHUM')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-100/80 text-indigo-900 border border-indigo-200 font-semibold transition"
          >
            📊 Pola Unggul Ekonomi &amp; Sosiologi (Soshum)
          </button>
          <button
            type="button"
            onClick={() => handlePreset('BALANCED')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-100/80 text-slate-700 border border-slate-200 font-semibold transition"
          >
            ⚖️ Nilai Rata-rata 85
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 text-xs font-semibold">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grades Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMapel.map(mapel => {
            const currentVal = grades[mapel.id_mapel] ?? 80;
            return (
              <div 
                key={mapel.id_mapel}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      {mapel.kategori}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {mapel.nama_mapel}
                    </h4>
                  </div>
                  <div className="w-16">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentVal}
                      onChange={(e) => handleGradeChange(mapel.id_mapel, e.target.value)}
                      className="w-full text-center py-1.5 px-2 font-black text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="1"
                    value={currentVal}
                    onChange={(e) => handleGradeChange(mapel.id_mapel, e.target.value)}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Save Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
          <div>
            <div className="text-xs font-bold text-slate-800">
              Simpan Data Rapor: <span className="text-indigo-600 font-bold">{selectedSiswa?.nama}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Sistem akan menjalankan Rule-Based Matching Engine otomatis begitu nilai disimpan.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={saving}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition ${
                saving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan & Menghitung...' : 'Simpan & Hitung Rekomendasi Siswa'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

    </div>
  );
}
