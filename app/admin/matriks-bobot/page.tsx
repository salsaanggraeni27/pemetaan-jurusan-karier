'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Save, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  HelpCircle,
  Sparkles,
  Calculator
} from 'lucide-react';

export default function MatriksBobotPage() {
  const [jurusanList, setJurusanList] = useState<any[]>([]);
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [selectedJurusanId, setSelectedJurusanId] = useState<number>(1);
  const [currentRules, setCurrentRules] = useState<{ [mapelId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/jurusan').then(res => res.json()),
      fetch('/api/mapel').then(res => res.json()),
    ]).then(([jurRes, mapelRes]) => {
      if (jurRes.success) setJurusanList(jurRes.data);
      if (mapelRes.success) setMapelList(mapelRes.data);
      if (jurRes.data?.length > 0) {
        setSelectedJurusanId(jurRes.data[0].id_jurusan);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // Fetch rules whenever selected jurusan changes
  useEffect(() => {
    if (!selectedJurusanId) return;
    setLoading(true);
    fetch(`/api/aturan-bobot?jurusanId=${selectedJurusanId}`)
      .then(res => res.json())
      .then(res => {
        const rulesMap: { [mapelId: number]: number } = {};
        if (res.success && Array.isArray(res.data)) {
          res.data.forEach((r: any) => {
            rulesMap[r.id_mapel] = r.bobot;
          });
        }
        setCurrentRules(rulesMap);
        setFeedback(null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedJurusanId]);

  const handleWeightChange = (mapelId: number, val: string | number) => {
    let numeric = Number(val);
    if (isNaN(numeric) || numeric < 0) numeric = 0;
    if (numeric > 100) numeric = 100;

    setCurrentRules(prev => ({
      ...prev,
      [mapelId]: numeric
    }));
  };

  const totalWeight = Object.values(currentRules).reduce((a, b) => a + (Number(b) || 0), 0);
  const isWeightValid = totalWeight === 100;

  const handleAutoNormalize = () => {
    if (totalWeight === 0) return;
    const normalized: { [mapelId: number]: number } = {};
    let runningSum = 0;
    const keys = Object.keys(currentRules).map(Number).filter(k => currentRules[k] > 0);

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        // assign remaining to make exactly 100
        normalized[k] = Math.max(0, 100 - runningSum);
      } else {
        const share = Math.round((currentRules[k] / totalWeight) * 100);
        normalized[k] = share;
        runningSum += share;
      }
    });

    setCurrentRules(normalized);
    setFeedback({ type: 'success', message: 'Bobot berhasil dinormalisasi otomatis menjadi 100%!' });
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    const rulesPayload = Object.entries(currentRules)
      .filter(([_, weight]) => Number(weight) > 0)
      .map(([mapelId, weight]) => ({
        id_mapel: parseInt(mapelId),
        bobot: Number(weight)
      }));

    try {
      const res = await fetch('/api/aturan-bobot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jurusanId: selectedJurusanId,
          rules: rulesPayload
        })
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({ type: 'success', message: 'Aturan matriks pembobotan berhasil disimpan ke database!' });
      } else {
        setFeedback({ type: 'error', message: data.message || 'Gagal menyimpan aturan.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan server saat menyimpan aturan.' });
    } finally {
      setSaving(false);
    }
  };

  const selectedJurusan = jurusanList.find(j => j.id_jurusan === selectedJurusanId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            Rule-Based Matrix Configurator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Konfigurasi Matriks Bobot Mapel per Jurusan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Atur persentase bobot mata pelajaran pendukung untuk setiap program studi perguruan tinggi di SMAN 1 Bandung.
          </p>
        </div>

        {/* Total Weight Status Pill */}
        <div className={`p-3.5 rounded-2xl border shadow-sm flex items-center gap-3 text-xs ${
          isWeightValid ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Akumulasi Bobot</span>
            <span className="text-xl font-black">{totalWeight}%</span>
          </div>
          {isWeightValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <button
              onClick={handleAutoNormalize}
              type="button"
              className="text-[11px] font-bold underline text-amber-800 hover:text-amber-950 ml-2"
            >
              Normalisasi 100%
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Jurusan Selection Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
          Pilih Program Studi yang Dikonfigurasi:
        </label>
        <div className="flex flex-wrap gap-2">
          {jurusanList.map(j => (
            <button
              key={j.id_jurusan}
              type="button"
              onClick={() => setSelectedJurusanId(j.id_jurusan)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedJurusanId === j.id_jurusan
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {j.nama_jurusan}
            </button>
          ))}
        </div>

        {selectedJurusan && (
          <div className="pt-2 text-xs text-slate-500 flex flex-wrap items-center gap-3">
            <span>Rumpun: <strong className="text-slate-800">{selectedJurusan.rumpun}</strong></span>
            <span>•</span>
            <span>Fakultas: <strong className="text-slate-800">{selectedJurusan.fakultas}</strong></span>
            <span>•</span>
            <span>Passing Grade: <strong className="text-blue-700">{selectedJurusan.passing_grade_indikatif}%</strong></span>
          </div>
        )}
      </div>

      {/* Sliders & Numeric Config Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <span className="font-bold">Mata Pelajaran Pendukung &amp; Bobot Aturan:</span>
          <span>Hanya mapel dengan bobot &gt; 0% yang dimasukkan ke formula kalkulasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mapelList.map(mapel => {
            const currentVal = currentRules[mapel.id_mapel] || 0;
            const hasWeight = currentVal > 0;

            return (
              <div
                key={mapel.id_mapel}
                className={`p-4 rounded-2xl border transition space-y-3 ${
                  hasWeight ? 'bg-white border-indigo-300 ring-1 ring-indigo-500/10 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {mapel.kategori}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {mapel.nama_mapel}
                    </h4>
                  </div>
                  <div className="w-16">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentVal}
                      onChange={(e) => handleWeightChange(mapel.id_mapel, e.target.value)}
                      className={`w-full text-center py-1 px-1.5 font-black rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        hasWeight ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={currentVal}
                    onChange={(e) => handleWeightChange(mapel.id_mapel, e.target.value)}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
        <div>
          <div className="text-xs font-bold text-slate-800">
            Total Bobot: <span className={isWeightValid ? 'text-emerald-700 font-extrabold' : 'text-amber-700 font-extrabold'}>{totalWeight}%</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {isWeightValid 
              ? 'Matriks pembobotan seimbang 100% dan siap disimpan.' 
              : 'Perhatian: Total bobot sebaiknya bernilai 100% agar perhitungan persentase akurat.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAutoNormalize}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            Normalisasi 100%
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition ${
              saving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan Matriks...' : 'Simpan Perubahan Aturan'}
          </button>
        </div>
      </div>

    </div>
  );
}

