'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileEdit, 
  Save, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  BookOpen, 
  Layers, 
  HelpCircle,
  Calculator
} from 'lucide-react';

interface MapelItem {
  id_mapel: number;
  nama_mapel: string;
  kategori: string;
  deskripsi?: string;
}

export default function InputNilaiPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mapelList, setMapelList] = useState<MapelItem[]>([]);
  const [grades, setGrades] = useState<{ [mapelId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  useEffect(() => {
    const saved = localStorage.getItem('sman1_user');
    if (!saved) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(saved);
    setUser(parsed);

    // Fetch master mapel and existing grades
    Promise.all([
      fetch('/api/mapel').then(res => res.json()),
      fetch(`/api/siswa/nilai?siswaId=${parsed.id}`).then(res => res.json())
    ]).then(([mapelRes, nilaiRes]) => {
      if (mapelRes.success) {
        setMapelList(mapelRes.data);
      }

      const initialGradesMap: { [id: number]: number } = {};
      if (nilaiRes.success && Array.isArray(nilaiRes.data)) {
        nilaiRes.data.forEach((n: any) => {
          initialGradesMap[n.id_mapel] = n.nilai;
        });
      }
      setGrades(initialGradesMap);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [router]);

  const handleGradeChange = (mapelId: number, value: string | number) => {
    let numeric = Number(value);
    if (isNaN(numeric)) numeric = 0;
    if (numeric > 100) numeric = 100;
    if (numeric < 0) numeric = 0;
    setGrades(prev => ({ ...prev, [mapelId]: numeric }));
  };

  const handlePreset = (type: 'MIPA_TECH' | 'MIPA_MED' | 'IPS_SOSHUM' | 'BALANCED') => {
    const presetMap: { [id: number]: number } = {};
    mapelList.forEach(m => {
      // Base grade
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
        // Balanced
        g = 85;
      }
      presetMap[m.id_mapel] = g;
    });
    setGrades(presetMap);
    setNotification({ type: 'success', message: `Preset nilai untuk profil ${type} berhasil dimuat!` });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setNotification(null);

    const payload = Object.entries(grades).map(([mapelId, nilai]) => ({
      id_mapel: parseInt(mapelId),
      nilai: Number(nilai)
    }));

    try {
      const res = await fetch('/api/siswa/nilai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siswaId: user.id,
          nilaiList: payload
        })
      });
      const data = await res.json();

      if (data.success) {
        setNotification({ type: 'success', message: 'Nilai rapor berhasil disimpan dan rekomendasi diperbarui!' });
        // Redirect to recommendations after a short delay
        setTimeout(() => {
          router.push('/siswa/rekomendasi');
        }, 800);
      } else {
        setNotification({ type: 'error', message: data.message || 'Gagal menyimpan nilai.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Terjadi kesalahan server saat menyimpan nilai.' });
    } finally {
      setSaving(false);
    }
  };

  // Kalkulasi ringkasan cepat
  const filledCount = Object.keys(grades).length;
  const gradeValues = Object.values(grades);
  const avgGrade = gradeValues.length > 0 
    ? (gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(1) 
    : '0';

  const categories = ['Semua', 'Wajib', 'Peminatan MIPA', 'Peminatan IPS', 'Peminatan Bahasa'];
  const filteredMapel = activeCategory === 'Semua' 
    ? mapelList 
    : mapelList.filter(m => m.kategori === activeCategory);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">Memuat form mata pelajaran...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Tahap 2: Input Data Akademik Siswa
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Form Nilai Rapor Semester
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Masukkan capaian nilai rapor skala 0 - 100 untuk mengaktifkan formula Rule-Based Matching.
          </p>
        </div>

        {/* Live Metrics Pill */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Terisi</span>
            <span className="font-extrabold text-slate-800 text-sm">{filledCount} / {mapelList.length} Mapel</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rata-Rata</span>
            <span className="font-extrabold text-blue-600 text-sm">{avgGrade}</span>
          </div>
        </div>
      </div>

      {/* Preset simulation buttons */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Isi Cepat Berdasarkan Profil Siswa:
          </span>
          <span className="text-[11px] text-blue-700 font-medium hidden sm:inline">Pilih skenario simulasi:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => handlePreset('MIPA_TECH')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-100/80 text-blue-800 border border-blue-200 font-semibold transition"
          >
            💻 Profil Saintek / Informatika
          </button>
          <button
            type="button"
            onClick={() => handlePreset('MIPA_MED')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-100/80 text-blue-800 border border-blue-200 font-semibold transition"
          >
            🩺 Profil Kedokteran / Farmasi
          </button>
          <button
            type="button"
            onClick={() => handlePreset('IPS_SOSHUM')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-100/80 text-blue-800 border border-blue-200 font-semibold transition"
          >
            📊 Profil Soshum / Ekonomi & Hukum
          </button>
          <button
            type="button"
            onClick={() => handlePreset('BALANCED')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-100/80 text-slate-700 border border-slate-200 font-semibold transition"
          >
            ⚖️ Nilai Rata-rata Seimbang (85)
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 text-xs font-semibold">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMapel.map(mapel => {
            const currentVal = grades[mapel.id_mapel] ?? 80;
            return (
              <div 
                key={mapel.id_mapel}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {mapel.kategori}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {mapel.nama_mapel}
                    </h4>
                    {mapel.deskripsi && (
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{mapel.deskripsi}</p>
                    )}
                  </div>
                  <div className="w-16">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentVal}
                      onChange={(e) => handleGradeChange(mapel.id_mapel, e.target.value)}
                      className="w-full text-center py-1.5 px-2 font-black text-blue-700 bg-blue-50 border border-blue-200 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Range Slider for fast mobile touch adjustment */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="1"
                    value={currentVal}
                    onChange={(e) => handleGradeChange(mapel.id_mapel, e.target.value)}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
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

        {/* Submit & Calculate Actions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
          <div>
            <div className="text-xs font-bold text-slate-800">Siap Menjalankan Rule-Based Matching?</div>
            <p className="text-[11px] text-slate-500">Nilai akan dicocokkan otomatis dengan seluruh matriks bobot program studi.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={saving}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition hover:scale-[1.01] ${
                saving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Calculator className="w-4 h-4" />
              {saving ? 'Menghitung Aturan...' : 'Eksekusi Rule-Based Matching'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

    </div>
  );
}
