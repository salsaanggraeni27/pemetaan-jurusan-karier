'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  CheckCircle, 
  AlertCircle,
  Building2,
  X
} from 'lucide-react';

export default function MasterJurusanPage() {
  const [jurusanList, setJurusanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJurusan, setEditingJurusan] = useState<any>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama_jurusan: '',
    rumpun: 'Saintek',
    fakultas: '',
    deskripsi: '',
    passing_grade_indikatif: 80,
    daya_tampung: 100,
    universitas_favorit: ''
  });

  const fetchJurusan = () => {
    fetch('/api/jurusan')
      .then(res => res.json())
      .then(res => {
        if (res.success) setJurusanList(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJurusan();
  }, []);

  const handleOpenAdd = () => {
    setEditingJurusan(null);
    setFormData({
      nama_jurusan: '',
      rumpun: 'Saintek',
      fakultas: '',
      deskripsi: '',
      passing_grade_indikatif: 85,
      daya_tampung: 100,
      universitas_favorit: 'ITB, UI, UGM'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingJurusan(item);
    setFormData({
      nama_jurusan: item.nama_jurusan,
      rumpun: item.rumpun,
      fakultas: item.fakultas,
      deskripsi: item.deskripsi,
      passing_grade_indikatif: item.passing_grade_indikatif,
      daya_tampung: item.daya_tampung,
      universitas_favorit: Array.isArray(item.universitas_favorit) 
        ? item.universitas_favorit.join(', ') 
        : item.universitas_favorit || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const payload: any = {
      ...formData,
      universitas_favorit: formData.universitas_favorit.split(',').map(s => s.trim())
    };

    if (editingJurusan) {
      payload.id_jurusan = editingJurusan.id_jurusan;
    }

    try {
      const res = await fetch('/api/jurusan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setNotification({ type: 'success', message: 'Data jurusan berhasil disimpan!' });
        setModalOpen(false);
        fetchJurusan();
      } else {
        setNotification({ type: 'error', message: data.message || 'Gagal menyimpan data.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Terjadi kesalahan server.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data program studi ini beserta matriks aturannya?')) return;

    try {
      const res = await fetch(`/api/jurusan?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', message: 'Jurusan berhasil dihapus.' });
        fetchJurusan();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Gagal menghapus jurusan.' });
    }
  };

  const filteredJurusan = jurusanList.filter(j => 
    j.nama_jurusan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.fakultas.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.rumpun.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Master Data Program Studi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Katalog Jurusan Perguruan Tinggi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar referensi program studi perguruan tinggi yang dievaluasi oleh sistem BK SMAN 1 Bandung.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> Tambah Jurusan Baru
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
            placeholder="Cari jurusan, fakultas, atau rumpun..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJurusan.map(j => (
          <div key={j.id_jurusan} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    j.rumpun === 'Saintek' ? 'bg-sky-100 text-sky-800' : j.rumpun === 'Soshum' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {j.rumpun}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-snug">
                    {j.nama_jurusan}
                  </h3>
                  <p className="text-xs text-slate-500">{j.fakultas}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(j)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(j.id_jurusan)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {j.deskripsi}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>Passing Grade: <strong className="text-blue-700">{j.passing_grade_indikatif}%</strong></span>
                <span>•</span>
                <span>Daya Tampung: <strong className="text-slate-800">{j.daya_tampung}</strong></span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 truncate">
              <strong>Kampus:</strong> {Array.isArray(j.universitas_favorit) ? j.universitas_favorit.join(', ') : j.universitas_favorit}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingJurusan ? 'Edit Program Studi' : 'Tambah Program Studi Baru'}
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
                <label className="block font-bold text-slate-700 mb-1">Nama Jurusan / Program Studi</label>
                <input
                  type="text"
                  required
                  value={formData.nama_jurusan}
                  onChange={e => setFormData({ ...formData, nama_jurusan: e.target.value })}
                  placeholder="Contoh: Teknik Informatika / Ilmu Komputer"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rumpun Keilmuan</label>
                  <select
                    value={formData.rumpun}
                    onChange={e => setFormData({ ...formData, rumpun: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  >
                    <option value="Saintek">Saintek</option>
                    <option value="Soshum">Soshum</option>
                    <option value="Campuran">Campuran</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fakultas</label>
                  <input
                    type="text"
                    required
                    value={formData.fakultas}
                    onChange={e => setFormData({ ...formData, fakultas: e.target.value })}
                    placeholder="Contoh: Fakultas Teknik"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Passing Grade Indikatif (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="50"
                    max="100"
                    required
                    value={formData.passing_grade_indikatif}
                    onChange={e => setFormData({ ...formData, passing_grade_indikatif: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Daya Tampung</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.daya_tampung}
                    onChange={e => setFormData({ ...formData, daya_tampung: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Referensi Kampus Favorit (Pisahkan Koma)</label>
                <input
                  type="text"
                  value={formData.universitas_favorit}
                  onChange={e => setFormData({ ...formData, universitas_favorit: e.target.value })}
                  placeholder="Contoh: ITB, UI, UGM, Unpad"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Kompetensi Jurusan</label>
                <textarea
                  rows={3}
                  required
                  value={formData.deskripsi}
                  onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Uraian ringkas kurikulum dan fokus pembelajaran..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
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
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow transition"
                >
                  Simpan Jurusan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
