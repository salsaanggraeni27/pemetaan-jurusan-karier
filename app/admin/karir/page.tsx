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
} from 'lucide-react';

export default function MasterKarirPage() {
  const [karirList, setKarirList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKarir, setEditingKarir] = useState<any>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    profesi: '',
    industri: '',
    deskripsi: '',
    estimasi_gaji: 'Rp 8.000.000 - Rp 20.000.000 / bulan',
    kualifikasi_utama: '',
    prospek_masa_depan: 'Tinggi',
  });

  const fetchKarir = () => {
    fetch('/api/karir')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setKarirList(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchKarir();
  }, []);

  const handleOpenAdd = () => {
    setEditingKarir(null);
    setFormData({
      profesi: '',
      industri: 'Teknologi Informasi',
      deskripsi: '',
      estimasi_gaji: 'Rp 8.000.000 - Rp 25.000.000 / bulan',
      kualifikasi_utama: 'Analisis Sistem, Komunikasi, Problem Solving',
      prospek_masa_depan: 'Sangat Tinggi',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingKarir(item);
    setFormData({
      profesi: item.profesi,
      industri: item.industri,
      deskripsi: item.deskripsi,
      estimasi_gaji: item.estimasi_gaji,
      kualifikasi_utama: Array.isArray(item.kualifikasi_utama)
        ? item.kualifikasi_utama.join(', ')
        : item.kualifikasi_utama || '',
      prospek_masa_depan: item.prospek_masa_depan,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const payload: any = {
      ...formData,
      kualifikasi_utama: formData.kualifikasi_utama
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
        setModalOpen(false);
        fetchKarir();
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Gagal menyimpan data karir.',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: 'Terjadi kesalahan server.',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus profesi karir ini?')) return;

    try {
      const res = await fetch(`/api/karir?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Data karir berhasil dihapus.',
        });
        fetchKarir();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Gagal menghapus karir.',
      });
    }
  };

  const filteredKarir = karirList.filter(
    (k) =>
      k.profesi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.industri.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#6e6e6e]">
            Master Data Karir &amp; Profesi · SMAN 1 Bandung
          </span>
          <h1 className="text-2xl font-bold text-[#333333] tracking-tight">
            Katalog Profesi &amp; Kualifikasi Kerja
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#6e6e6e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari profesi atau industri..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg bg-white border border-[#cccccc] text-[#333333]"
            />
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex h-9 items-center gap-1.5 px-3.5 rounded-md bg-[#df6035] text-white text-xs font-medium hover:opacity-90 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          role="status"
          className={`p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 border ${
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredKarir.map((k) => (
          <div
            key={k.id_karir}
            className="bg-white border border-[#cccccc] rounded-xl p-5 space-y-3 flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-medium text-[#6e6e6e]">
                    {k.industri}
                  </span>
                  <h2 className="text-base font-bold text-[#333333]">
                    {k.profesi}
                  </h2>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(k)}
                    className="w-8 h-8 rounded-md text-[#6e6e6e] hover:text-[#333333] hover:bg-[#f4f5f7] flex items-center justify-center cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(k.id_karir)}
                    className="w-8 h-8 rounded-md text-[#6e6e6e] hover:text-red-700 hover:bg-red-50 flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#6e6e6e] leading-relaxed">
                {k.deskripsi}
              </p>
            </div>

            <div className="pt-3 border-t border-[#cccccc]/60 flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-[#2f4b79]">
                {k.estimasi_gaji}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#e8ebed] text-[#333333] font-medium">
                Prospek {k.prospek_masa_depan}
              </span>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-[#cccccc] shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#cccccc]">
              <h2 className="text-base font-bold text-[#333333]">
                {editingKarir ? 'Edit Data Profesi' : 'Tambah Profesi Karir'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-md bg-[#f4f5f7] text-[#333333] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#333333] mb-1">
                  Nama Profesi
                </label>
                <input
                  type="text"
                  required
                  value={formData.profesi}
                  onChange={(e) =>
                    setFormData({ ...formData, profesi: e.target.value })
                  }
                  className="h-9 w-full px-3 rounded-md border border-[#cccccc] bg-[#f4f5f7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#333333] mb-1">
                    Industri
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.industri}
                    onChange={(e) =>
                      setFormData({ ...formData, industri: e.target.value })
                    }
                    className="h-9 w-full px-3 rounded-md border border-[#cccccc] bg-[#f4f5f7]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#333333] mb-1">
                    Prospek
                  </label>
                  <select
                    value={formData.prospek_masa_depan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prospek_masa_depan: e.target.value,
                      })
                    }
                    className="h-9 w-full px-2.5 rounded-md border border-[#cccccc] bg-[#f4f5f7]"
                  >
                    <option value="Sangat Tinggi">Sangat Tinggi</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Stabil">Stabil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#333333] mb-1">
                  Estimasi Gaji
                </label>
                <input
                  type="text"
                  required
                  value={formData.estimasi_gaji}
                  onChange={(e) =>
                    setFormData({ ...formData, estimasi_gaji: e.target.value })
                  }
                  className="h-9 w-full px-3 rounded-md border border-[#cccccc] bg-[#f4f5f7] font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-[#333333] mb-1">
                  Kualifikasi Utama (pisahkan koma)
                </label>
                <input
                  type="text"
                  required
                  value={formData.kualifikasi_utama}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kualifikasi_utama: e.target.value,
                    })
                  }
                  className="h-9 w-full px-3 rounded-md border border-[#cccccc] bg-[#f4f5f7]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#333333] mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  className="w-full p-2.5 rounded-md border border-[#cccccc] bg-[#f4f5f7]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-9 px-3 rounded-md border border-[#cccccc] bg-[#f4f5f7] font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-md bg-[#df6035] text-white font-medium cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
