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

export default function MasterMapelPage() {
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMapel, setEditingMapel] = useState<any>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    nama_mapel: '',
    kategori: 'Wajib',
    deskripsi: '',
  });

  const fetchMapel = () => {
    fetch('/api/mapel')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setMapelList(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMapel();
  }, []);

  const handleOpenAdd = () => {
    setEditingMapel(null);
    setFormData({
      nama_mapel: '',
      kategori: 'Wajib',
      deskripsi: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingMapel(item);
    setFormData({
      nama_mapel: item.nama_mapel,
      kategori: item.kategori,
      deskripsi: item.deskripsi || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const payload: any = { ...formData };
    if (editingMapel) {
      payload.id_mapel = editingMapel.id_mapel;
    }

    try {
      const res = await fetch('/api/mapel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Mata pelajaran berhasil disimpan.',
        });
        setModalOpen(false);
        fetchMapel();
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Gagal menyimpan mapel.',
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
    if (!confirm('Yakin ingin menghapus mata pelajaran ini?')) return;

    try {
      const res = await fetch(`/api/mapel?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Mata pelajaran berhasil dihapus.',
        });
        fetchMapel();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Gagal menghapus mapel.',
      });
    }
  };

  const filteredMapel = mapelList.filter(
    (m) =>
      m.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#6e6e6e]">
            Master Data Mata Pelajaran · SMAN 1 Bandung
          </span>
          <h1 className="text-2xl font-bold text-[#333333] tracking-tight">
            Mata Pelajaran Kurikulum Rapor
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#6e6e6e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mapel atau kategori..."
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

      <div className="bg-white border border-[#cccccc] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#f4f5f7] text-[#6e6e6e] border-b border-[#cccccc] text-xs">
              <th className="py-3 px-4 font-medium w-14">ID</th>
              <th className="py-3 px-4 font-medium">Mata Pelajaran</th>
              <th className="py-3 px-4 font-medium">Kategori</th>
              <th className="py-3 px-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#cccccc]/60">
            {filteredMapel.map((m) => (
              <tr key={m.id_mapel} className="hover:bg-[#f4f5f7]/60">
                <td className="py-3 px-4 font-mono text-xs text-[#6e6e6e]">
                  #{m.id_mapel}
                </td>
                <td className="py-3 px-4 font-semibold text-[#333333]">
                  {m.nama_mapel}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-[#e8ebed] text-[#2f4b79] text-xs font-medium">
                    {m.kategori}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(m)}
                      className="w-8 h-8 rounded-md text-[#6e6e6e] hover:text-[#333333] hover:bg-[#f4f5f7] flex items-center justify-center cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id_mapel)}
                      className="w-8 h-8 rounded-md text-[#6e6e6e] hover:text-red-700 hover:bg-red-50 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                {editingMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
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
                  Nama Mata Pelajaran
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_mapel}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_mapel: e.target.value })
                  }
                  className="h-9 w-full px-3 rounded-md border border-[#cccccc] bg-[#f4f5f7]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#333333] mb-1">
                  Kategori
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                  className="h-9 w-full px-2.5 rounded-md border border-[#cccccc] bg-[#f4f5f7]"
                >
                  <option value="Wajib">Wajib</option>
                  <option value="Peminatan MIPA">Peminatan MIPA</option>
                  <option value="Peminatan IPS">Peminatan IPS</option>
                  <option value="Peminatan Bahasa">Peminatan Bahasa</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#333333] mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
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
