'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  CheckCircle, 
  X 
} from 'lucide-react';

export default function MasterMapelPage() {
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMapel, setEditingMapel] = useState<any>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    nama_mapel: '',
    kategori: 'Wajib',
    deskripsi: ''
  });

  const fetchMapel = () => {
    fetch('/api/mapel')
      .then(res => res.json())
      .then(res => {
        if (res.success) setMapelList(res.data || []);
        setLoading(false);
      })
      .catch(err => {
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
      deskripsi: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingMapel(item);
    setFormData({
      nama_mapel: item.nama_mapel,
      kategori: item.kategori,
      deskripsi: item.deskripsi || ''
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
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setNotification({ type: 'success', message: 'Mata pelajaran berhasil disimpan!' });
        setModalOpen(false);
        fetchMapel();
      } else {
        setNotification({ type: 'error', message: data.message || 'Gagal menyimpan mapel.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Terjadi kesalahan server.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus mata pelajaran ini? Semua aturan bobot terkait akan disesuaikan.')) return;

    try {
      const res = await fetch(`/api/mapel?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', message: 'Mata pelajaran berhasil dihapus.' });
        fetchMapel();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Gagal menghapus mapel.' });
    }
  };

  const filteredMapel = mapelList.filter(m =>
    m.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Master Data Mata Pelajaran
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mata Pelajaran Kurikulum Rapor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Konfigurasi mata pelajaran rapor siswa SMAN 1 Bandung (Kelompok Wajib dan Peminatan).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> Tambah Mapel Baru
        </button>
      </div>

      {notification && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mata pelajaran atau kategori..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-4 font-bold w-16">ID</th>
                <th className="py-3 px-4 font-bold">Nama Mata Pelajaran</th>
                <th className="py-3 px-4 font-bold">Kategori Kurikulum</th>
                <th className="py-3 px-4 font-bold">Deskripsi Fokus Kompetensi</th>
                <th className="py-3 px-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMapel.map(m => (
                <tr key={m.id_mapel} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono text-slate-400">#{m.id_mapel}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{m.nama_mapel}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      m.kategori === 'Wajib' ? 'bg-slate-100 text-slate-700' :
                      m.kategori === 'Peminatan MIPA' ? 'bg-blue-100 text-blue-800' :
                      m.kategori === 'Peminatan IPS' ? 'bg-amber-100 text-amber-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {m.kategori}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{m.deskripsi || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id_mapel)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
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
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  value={formData.nama_mapel}
                  onChange={e => setFormData({ ...formData, nama_mapel: e.target.value })}
                  placeholder="Contoh: Matematika Tingkat Lanjut"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Kurikulum</label>
                <select
                  value={formData.kategori}
                  onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  <option value="Wajib">Wajib</option>
                  <option value="Peminatan MIPA">Peminatan MIPA</option>
                  <option value="Peminatan IPS">Peminatan IPS</option>
                  <option value="Peminatan Bahasa">Peminatan Bahasa</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Kompetensi Dasar</label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Ringkasan materi atau bidang keilmuan..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow transition"
                >
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

