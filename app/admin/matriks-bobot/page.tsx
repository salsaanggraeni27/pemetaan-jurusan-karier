'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MatriksBobotPage() {
  const [jurusanList, setJurusanList] = useState<any[]>([]);
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [selectedJurusanId, setSelectedJurusanId] = useState<number>(1);
  const [currentRules, setCurrentRules] = useState<{
    [mapelId: number]: number;
  }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/jurusan').then((res) => res.json()),
      fetch('/api/mapel').then((res) => res.json()),
    ])
      .then(([jurRes, mapelRes]) => {
        if (jurRes.success) setJurusanList(jurRes.data);
        if (mapelRes.success) setMapelList(mapelRes.data);
        if (jurRes.data?.length > 0) {
          setSelectedJurusanId(jurRes.data[0].id_jurusan);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedJurusanId) return;
    setLoading(true);
    fetch(`/api/aturan-bobot?jurusanId=${selectedJurusanId}`)
      .then((res) => res.json())
      .then((res) => {
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
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedJurusanId]);

  const handleWeightChange = (mapelId: number, val: string | number) => {
    let numeric = Number(val);
    if (isNaN(numeric) || numeric < 0) numeric = 0;
    if (numeric > 100) numeric = 100;

    setCurrentRules((prev) => ({
      ...prev,
      [mapelId]: numeric,
    }));
  };

  const totalWeight = Object.values(currentRules).reduce(
    (a, b) => a + (Number(b) || 0),
    0
  );
  const isWeightValid = totalWeight === 100;

  const handleAutoNormalize = () => {
    if (totalWeight === 0) return;
    const normalized: { [mapelId: number]: number } = {};
    let runningSum = 0;
    const keys = Object.keys(currentRules)
      .map(Number)
      .filter((k) => currentRules[k] > 0);

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        normalized[k] = Math.max(0, 100 - runningSum);
      } else {
        const share = Math.round((currentRules[k] / totalWeight) * 100);
        normalized[k] = share;
        runningSum += share;
      }
    });

    setCurrentRules(normalized);
    setFeedback({
      type: 'success',
      message: 'Bobot berhasil dinormalisasi otomatis menjadi 100%.',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    const rulesPayload = Object.entries(currentRules)
      .filter(([_, weight]) => Number(weight) > 0)
      .map(([mapelId, weight]) => ({
        id_mapel: parseInt(mapelId),
        bobot: Number(weight),
      }));

    try {
      const res = await fetch('/api/aturan-bobot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jurusanId: selectedJurusanId,
          rules: rulesPayload,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({
          type: 'success',
          message: 'Aturan matriks pembobotan berhasil disimpan.',
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Gagal menyimpan aturan.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Terjadi kesalahan server saat menyimpan aturan.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-7 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="cairn-kicker">
            Rule-Based Matrix Configurator · SMAN 1 Bandung
          </span>
          <h1 className="font-serif-cairn text-4xl text-[#111211]">
            Editor pembobotan mapel per jurusan.
          </h1>
        </div>

        <div className="cairn-card px-4 py-2.5 flex items-center gap-3">
          <div>
            <span className="font-mono-cairn text-[10px] uppercase tracking-wider text-[#686b67] block">
              Total Bobot
            </span>
            <span
              className={`font-mono-cairn text-base font-semibold ${
                isWeightValid ? 'text-[#2a6ee0]' : 'text-[#e4572e]'
              }`}
            >
              {totalWeight}%
            </span>
          </div>
          <button
            type="button"
            onClick={handleAutoNormalize}
            className="cairn-pill-soft !h-8 !px-3 !text-xs cursor-pointer"
          >
            Normalisasi 100%
          </button>
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
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="cairn-card p-5">
        <label
          htmlFor="select-jurusan"
          className="font-mono-cairn text-[10.5px] uppercase tracking-wider text-[#686b67] block mb-1.5"
        >
          Pilih Program Studi
        </label>
        <select
          id="select-jurusan"
          value={selectedJurusanId}
          onChange={(e) => setSelectedJurusanId(Number(e.target.value))}
          className="h-10 w-full px-3.5 rounded-xl border border-black/10 text-sm font-medium text-[#151615] bg-[#f1f1ef] cursor-pointer"
        >
          {jurusanList.map((j) => (
            <option key={j.id_jurusan} value={j.id_jurusan}>
              {j.nama_jurusan} ({j.rumpun} — {j.fakultas})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {mapelList.map((mapel) => {
          const currentVal = currentRules[mapel.id_mapel] || 0;
          const hasWeight = currentVal > 0;

          return (
            <div
              key={mapel.id_mapel}
              className={`cairn-card p-4 flex items-center justify-between gap-3 ${
                hasWeight ? 'ring-1 ring-[#111211]' : 'opacity-75'
              }`}
            >
              <div>
                <span className="font-mono-cairn text-[10px] uppercase tracking-wider text-[#686b67] block">
                  {mapel.kategori}
                </span>
                <label
                  htmlFor={`weight-input-${mapel.id_mapel}`}
                  className="text-sm font-semibold text-[#151615]"
                >
                  {mapel.nama_mapel}
                </label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  id={`weight-input-${mapel.id_mapel}`}
                  type="number"
                  min="0"
                  max="100"
                  value={currentVal}
                  onChange={(e) =>
                    handleWeightChange(mapel.id_mapel, e.target.value)
                  }
                  className={`w-16 h-9 text-center font-mono-cairn font-semibold rounded-xl text-sm border tabular-nums ${
                    hasWeight
                      ? 'bg-[#111211] text-[#f7f7f5] border-[#111211]'
                      : 'bg-[#f1f1ef] text-[#686b67] border-black/10'
                  }`}
                />
                <span className="text-xs font-mono-cairn text-[#686b67]">
                  %
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="cairn-pill !h-10 !px-6 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Aturan Bobot'}</span>
        </button>
      </div>
    </div>
  );
}
