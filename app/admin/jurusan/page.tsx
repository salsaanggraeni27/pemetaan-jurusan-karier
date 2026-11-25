'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  Briefcase,
} from 'lucide-react';
import { PillTabs } from '@/components/ui/pill-tabs';

export default function MasterJurusanKarirPage() {
  const [activeTab, setActiveTab] = useState<string>('JURUSAN');
  const [jurusanList, setJurusanList] = useState<any[]>([]);
  const [karirList, setKarirList] = useState<any[]>([]);
  const [relasiList, setRelasiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Jurusan Modal
  const [jurusanModalOpen, setJurusanModalOpen] = useState(false);
  const [editingJurusan, setEditingJurusan] = useState<any>(null);
  const [selectedKarirIds, setSelectedKarirIds] = useState<number[]>([]);
  const [jurusanForm, setJurusanForm] = useState({
    nama_jurusan: '',
    rumpun: 'Saintek',
    fakultas: '',
    deskripsi: '',
    passing_grade_indikatif: 85,
    daya_tampung: 100,
    universitas_favorit: 'ITB, UI, UGM',
  });

  // Karir Modal
  const [karirModalOpen, setKarirModalOpen] = useState(false);
  const [editingKarir, setEditingKarir] = useState<any>(null);
  const [karirForm, setKarirForm] = useState({
    profesi: '',
    industri: 'Teknologi Informasi',
    deskripsi: '',
    estimasi_gaji: 'Rp 8.000.000 - Rp 25.000.000 / bulan',
    kualifikasi_utama: 'Analisis Sistem, Problem Solving',
    prospek_masa_depan: 'Sangat Tinggi',
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/jurusan').then((res) => res.json()),
      fetch('/api/karir').then((res) => res.json()),
    ])
      .then(([jurRes, karirRes]) => {
        if (jurRes.success) setJurusanList(jurRes.data || []);
        if (karirRes.success) {
          setKarirList(karirRes.data || []);
          setRelasiList(karirRes.relasi || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getKarirForJurusan = (jurusanId: number) => {
    const rels = relasiList.filter((r) => r.id_jurusan === jurusanId);
    const ids = new Set(rels.map((r) => r.id_karir));
    return karirList.filter((k) => ids.has(k.id_karir));
  };

  // --- JURUSAN HANDLERS ---
  const handleOpenAddJurusan = () => {
    setEditingJurusan(null);
    setSelectedKarirIds([]);
    setJurusanForm({
      nama_jurusan: '',
      rumpun: 'Saintek',
      fakultas: '',
      deskripsi: '',
      passing_grade_indikatif: 85,
      daya_tampung: 100,
      universitas_favorit: 'ITB, UI, UGM',
    });
    setJurusanModalOpen(true);
  };

  const handleOpenEditJurusan = (item: any) => {
    setEditingJurusan(item);
    const currentKarirs = relasiList
      .filter((r) => r.id_jurusan === item.id_jurusan)
      .map((r) => r.id_karir);
    setSelectedKarirIds(currentKarirs);
    setJurusanForm({
      nama_jurusan: item.nama_jurusan,
      rumpun: item.rumpun,
      fakultas: item.fakultas,
      deskripsi: item.deskripsi,
      passing_grade_indikatif: item.passing_grade_indikatif,
      daya_tampung: item.daya_tampung,
      universitas_favorit: Array.isArray(item.universitas_favorit)
        ? item.universitas_favorit.join(', ')
        : item.universitas_favorit || '',
    });
    setJurusanModalOpen(true);
  };

  const toggleKarirSelection = (karirId: number) => {
    setSelectedKarirIds((prev) =>
      prev.includes(karirId)
        ? prev.filter((id) => id !== karirId)
        : [...prev, karirId]
    );
  };

  const handleSubmitJurusan = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const payload: any = {
      ...jurusanForm,
      universitas_favorit: jurusanForm.universitas_favorit
        .split(',')
        .map((s) => s.trim()),
      karirIds: selectedKarirIds,
    };

    if (editingJurusan) {
      payload.id_jurusan = editingJurusan.id_jurusan;
    }

    try {
      const res = await fetch('/api/jurusan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Data jurusan & relasi karir berhasil disimpan.',
        });
        setJurusanModalOpen(false);
        fetchAll();
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Gagal menyimpan data jurusan.',
        });
      }
    } catch {
      setNotification({
        type: 'error',
        message: 'Terjadi kesalahan server.',
      });
    }
  };

  const handleDeleteJurusan = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data program studi ini?')) return;
    try {
      const res = await fetch(`/api/jurusan?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Data jurusan berhasil dihapus.',
        });
        fetchAll();
      }
    } catch {
      setNotification({
        type: 'error',
        message: 'Gagal menghapus jurusan.',
      });
    }
  };

  // --- KARIR HANDLERS ---
  const handleOpenAddKarir = () => {
    setEditingKarir(null);
    setKarirForm({
      profesi: '',
      industri: 'Teknologi Informasi',
      deskripsi: '',
      estimasi_gaji: 'Rp 8.000.000 - Rp 25.000.000 / bulan',
      kualifikasi_utama: 'Analisis Sistem, Problem Solving',
      prospek_masa_depan: 'Sangat Tinggi',
    });
    setKarirModalOpen(true);
  };

  const handleOpenEditKarir = (item: any) => {
    setEditingKarir(item);
    setKarirForm({
      profesi: item.profesi,
      industri: item.industri,
      deskripsi: item.deskripsi,
      estimasi_gaji: item.estimasi_gaji,
      kualifikasi_utama: Array.isArray(item.kualifikasi_utama)
        ? item.kualifikasi_utama.join(', ')
        : item.kualifikasi_utama || '',
      prospek_masa_depan: item.prospek_masa_depan,
    });
    setKarirModalOpen(true);
  };

  const handleSubmitKarir = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const payload: any = {
      ...karirForm,
      kualifikasi_utama: karirForm.kualifikasi_utama
        .split(',')
        .map((s) => s.trim()),
    };

    if (editingKarir) {
      payload.id_karir = editingKarir.id_karir;
    }

    try {
      const res = await fetch('/api/karir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Data karir berhasil disimpan.',
        });
        setKarirModalOpen(false);
        fetchAll();
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Gagal menyimpan data karir.',
        });
      }
    } catch {
      setNotification({
        type: 'error',
        message: 'Terjadi kesalahan server.',
      });
    }
  };

  const handleDeleteKarir = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data karir ini?')) return;
    try {
      const res = await fetch(`/api/karir?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Data karir berhasil dihapus.',
        });
        fetchAll();
      }
    } catch {
      setNotification({
        type: 'error',
        message: 'Gagal menghapus karir.',
      });
    }
  };

  const filteredJurusan = jurusanList.filter(
    (j) =>
      j.nama_jurusan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.fakultas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.rumpun.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredKarir = karirList.filter(
    (k) =>
      k.profesi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.industri.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-7 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="cairn-kicker">
            Manajemen Master Data · SMAN 1 Bandung
          </span>
          <h1 className="font-serif-cairn text-4xl text-[#111211]">
            CRUD data jurusan &amp; prospek karir.
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-60">
            <Search className="w-4 h-4 text-[#878a86] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jurusan atau karir..."
              className="w-full h-9 pl-10 pr-3 text-xs rounded-full bg-white border border-black/10 text-[#111211]"
            />
          </div>

          {activeTab === 'JURUSAN' ? (
            <button
              type="button"
              onClick={handleOpenAddJurusan}
              className="cairn-pill cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jurusan</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAddKarir}
              className="cairn-pill cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Karir</span>
            </button>
          )}
        </div>
      </div>

      <PillTabs
        tabs={[
          { id: 'JURUSAN', label: `Data Jurusan (${jurusanList.length})` },
          { id: 'KARIR', label: `Data Prospek Karir (${karirList.length})` },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {notification && (
        <div
          role="status"
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-700" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {activeTab === 'JURUSAN' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJurusan.map((j) => {
            const linkedKarirs = getKarirForJurusan(j.id_jurusan);

            return (
              <div
                key={j.id_jurusan}
                className="cairn-card p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono-cairn text-[10.5px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f1f1ef] text-[#111211]">
                        {j.rumpun}
                      </span>
                      <h2 className="font-serif-cairn text-2xl text-[#151615] mt-2">
                        {j.nama_jurusan}
                      </h2>
                      <p className="text-xs text-[#686b67]">{j.fakultas}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditJurusan(j)}
                        className="w-8 h-8 rounded-full text-[#686b67] hover:text-[#111211] hover:bg-[#f1f1ef] flex items-center justify-center cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteJurusan(j.id_jurusan)}
                        className="w-8 h-8 rounded-full text-[#686b67] hover:text-[#e4572e] hover:bg-[#f1f1ef] flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#5c5f5b] leading-relaxed">
                    {j.deskripsi}
                  </p>

                  {/* Relasi Karir */}
                  <div className="pt-2.5 border-t border-black/10 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-mono-cairn text-[10.5px] uppercase tracking-wider text-[#686b67]">
                      <Briefcase className="w-3.5 h-3.5 text-[#e4572e]" />
                      <span>Prospek Karir Terhubung</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {linkedKarirs.length > 0 ? (
                        linkedKarirs.map((k) => (
                          <span
                            key={k.id_karir}
                            className="px-2.5 py-0.5 rounded-full bg-[#f1f1ef] text-[11px] font-medium text-[#151615]"
                          >
                            {k.profesi}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-[#878a86]">
                          Belum dipilih (klik Edit untuk menghubungkan karir)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs text-[#686b67]">
                  <span>
                    Passing Grade:{' '}
                    <strong className="font-mono-cairn text-[#e4572e]">
                      {j.passing_grade_indikatif}%
                    </strong>
                  </span>
                  <span>
                    Kampus:{' '}
                    <strong className="text-[#151615]">
                      {Array.isArray(j.universitas_favorit)
                        ? j.universitas_favorit.slice(0, 2).join(', ')
                        : j.universitas_favorit}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredKarir.map((k) => (
            <div
              key={k.id_karir}
              className="cairn-card p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono-cairn text-[10.5px] uppercase tracking-wider text-[#686b67]">
                      {k.industri}
                    </span>
                    <h2 className="font-serif-cairn text-2xl text-[#151615] mt-1">
                      {k.profesi}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditKarir(k)}
                      className="w-8 h-8 rounded-full text-[#686b67] hover:text-[#111211] hover:bg-[#f1f1ef] flex items-center justify-center cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteKarir(k.id_karir)}
                      className="w-8 h-8 rounded-full text-[#686b67] hover:text-[#e4572e] hover:bg-[#f1f1ef] flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#5c5f5b] leading-relaxed">
                  {k.deskripsi}
                </p>
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs">
                <span className="font-mono-cairn font-semibold text-[#2a6ee0]">
                  {k.estimasi_gaji}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f1f1ef] text-[#151615] font-medium">
                  Prospek {k.prospek_masa_depan}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah/Edit Jurusan + Pilih Relasi Karir */}
      {jurusanModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="cairn-card max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <h2 className="font-serif-cairn text-2xl text-[#111211]">
                {editingJurusan
                  ? 'Edit Jurusan & Prospek Karir'
                  : 'Tambah Jurusan Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setJurusanModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f1ef] text-[#111211] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitJurusan} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#151615] mb-1">
                  Nama Program Studi
                </label>
                <input
                  type="text"
                  required
                  value={jurusanForm.nama_jurusan}
                  onChange={(e) =>
                    setJurusanForm({
                      ...jurusanForm,
                      nama_jurusan: e.target.value,
                    })
                  }
                  className="h-9 w-full px-3 rounded-xl border border-black/10 bg-[#f1f1ef]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#151615] mb-1">
                    Rumpun
                  </label>
                  <select
                    value={jurusanForm.rumpun}
                    onChange={(e) =>
                      setJurusanForm({ ...jurusanForm, rumpun: e.target.value })
                    }
                    className="h-9 w-full px-2.5 rounded-xl border border-black/10 bg-[#f1f1ef]"
                  >
                    <option value="Saintek">Saintek</option>
                    <option value="Soshum">Soshum</option>
                    <option value="Campuran">Campuran</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#151615] mb-1">
                    Fakultas
                  </label>
                  <input
                    type="text"
                    required
                    value={jurusanForm.fakultas}
                    onChange={(e) =>
                      setJurusanForm({
                        ...jurusanForm,
                        fakultas: e.target.value,
                      })
                    }
                    className="h-9 w-full px-3 rounded-xl border border-black/10 bg-[#f1f1ef]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#151615] mb-1">
                    Passing Grade (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={jurusanForm.passing_grade_indikatif}
                    onChange={(e) =>
                      setJurusanForm({
                        ...jurusanForm,
                        passing_grade_indikatif: Number(e.target.value),
                      })
                    }
                    className="h-9 w-full px-3 rounded-xl border border-black/10 bg-[#f1f1ef] font-mono-cairn"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#151615] mb-1">
                    Daya Tampung
                  </label>
                  <input
                    type="number"
                    required
                    value={jurusanForm.daya_tampung}
                    onChange={(e) =>
                      setJurusanForm({
                        ...jurusanForm,
                        daya_tampung: Number(e.target.value),
                      })
                    }
                    className="h-9 w-full px-3 rounded-xl border border-black/10 bg-[#f1f1ef] font-mono-cairn"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#151615] mb-1">
                  Kampus Favorit (pisahkan koma)
                </label>
                <input
                  type="text"
                  value={jurusanForm.universitas_favorit}
                  onChange={(e) =>
                    setJurusanForm({
                      ...jurusanForm,
                      universitas_favorit: e.target.value,
                    })
                  }
                  className="h-9 w-full px-3 rounded-xl border border-black/10 bg-[#f1f1ef]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#151615] mb-1">
                  Deskripsi Jurusan
                </label>
                <textarea
                  rows={2}
                  required
                  value={jurusanForm.deskripsi}
                  onChange={(e) =>
                    setJurusanForm({
                      ...jurusanForm,
                      deskripsi: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-black/10 bg-[#f1f1ef]"
                />
              </div>

              {/* Pilihan Relasi Prospek Karir */}
              <div>
                <label className="block font-medium text-[#151615] mb-1">
                  Hubungkan Prospek Karir Lulusan:
                </label>
                <div className="max-h-36 overflow-y-auto p-2.5 rounded-xl border border-black/10 bg-[#f1f1ef] grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {karirList.map((k) => {
                    const checked = selectedKarirIds.includes(k.id_karir);
                    return (
                      <label
                        key={k.id_karir}
                        className="flex items-center gap-2 text-xs text-[#151615] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleKarirSelection(k.id_karir)}
                          className="accent-[#111211]"
                        />
                        <span className="truncate">{k.profesi}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setJurusanModalOpen(false)}
                  className="cairn-pill-soft cursor-pointer"
                >
                  Batal
                </button>
                <button type="submit" className="cairn-pill cursor-pointer">
                  Simpan Jurusan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Karir */}
      {karirModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="cairn-card max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <h2 className="font-serif-cairn text-2xl text-[#111211]">
                {editingKarir
                  ? 'Edit Data Profesi Karir'
                  : 'Tambah Profesi Karir'}
              </h2>
              <button
                type="button"
                onClick={() => setKarirModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f1ef] text-[#111211] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitKarir} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#151615] mb-1">
                  Nama Profesi
                </label>
                <input
                  type="text"
                  required
                  value={karirForm.profesi}
                  onChange={(e) =>
                    setKarirForm({ ...karirForm, profesi: e.target.value })
                  }
                  className="h-9 w-full px-3 rounded-xl border border-black/10 bg-[#f1f1ef]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#151615] mb-1">
                    Industri
                  </label>
                  <input
                    type="text"
                    required
                    value={karirForm.industri}
                    onChange={(e) =>
                      setKarirForm({ ...karirForm, industri: e.target.value })
                    }
                    className="h-9 w-full px-3 rounded-xl border border-black/10 bg-[#f1f1ef]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#151615] mb-1">
                    Prospek
                  </label>
                  <select
                    value={karirForm.prospek_masa_depan}
                    onChange={(e) =>
                      setKarirForm({
                        ...karirForm,
                        prospek_masa_depan: e.target.value,
                      })
                    }
                    className="h-9 w-full px-2.5 rounded-xl border border-black/10 bg-[#f1f1ef]"
                  >
                    <option value="Sangat Tinggi">Sangat Tinggi</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Stabil">Stabil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#151615] mb-1">
                  Estimasi Gaji
                </label>
                <input
                  type="text"
                  required
                  value={karirForm.estimasi_gaji}
                  onChange={(e) =>
                    setKarirForm({
                      ...karirForm,
                      estimasi_gaji: e.target.value,
                    })
                  }
                  className="h-9 w-full px-3 rounded-xl border border-black/10 bg-[#f1f1ef] font-mono-cairn"
                />
              </div>

              <div>
                <label className="block font-medium text-[#151615] mb-1">
                  Kualifikasi Utama (pisahkan koma)
                </label>
                <input
                  type="text"
                  required
                  value={karirForm.kualifikasi_utama}
                  onChange={(e) =>
                    setKarirForm({
                      ...karirForm,
                      kualifikasi_utama: e.target.value,
                    })
                  }
                  className="h-9 w-full px-3 rounded-xl border border-black/10 bg-[#f1f1ef]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#151615] mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  required
                  value={karirForm.deskripsi}
                  onChange={(e) =>
                    setKarirForm({ ...karirForm, deskripsi: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-black/10 bg-[#f1f1ef]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setKarirModalOpen(false)}
                  className="cairn-pill-soft cursor-pointer"
                >
                  Batal
                </button>
                <button type="submit" className="cairn-pill cursor-pointer">
                  Simpan Karir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
