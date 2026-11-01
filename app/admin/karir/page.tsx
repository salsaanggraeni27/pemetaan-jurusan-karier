'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  CheckCircle, 
  DollarSign, 
  Sparkles,
  X 
} from 'lucide-react';

export default function MasterKarirPage() {
  const [karirList, setKarirList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKarir, setEditingKarir] = useState<any>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    profesi: '',
    industri: '',
    deskripsi: '',
    estimasi_gaji: 'Rp 8.000.000 - Rp 20.000.000 / bulan',
    kualifikasi_utama: '',
    prospek_masa_depan: 'Tinggi'
  });

  const fetchKarir = () => {
    fetch('/api/karir')
      .then(res => res.json())
      .then(res => {
        if (res.success) setKarirList(res.data || []);
        setLoading(false);
      })
      .catch(err => {
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
      prospek_masa_depan: 'Sangat Tinggi'
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
      prospek_masa_depan: item.prospek_masa_depan
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const payload: any = {
      ...formData,
      kualifikasi_utama: formData.kualifikasi_utama.split(',').map(s => s.trim())
    };

    if (editingKarir) {
      payload.id_karir = editingKarir.id_karir;
    }

    try {
      const res = await fetch('/api/karir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setNotification({ type: 'success', message: 'Data karir berhasil disimpan!' });
        setModalOpen(false);
        fetchKarir();
      } else {
        setNotification({ type: 'error', message: data.message || 'Gagal menyimpan data karir.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Terjadi kesalahan server.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus profesi karir ini?')) return;

    try {
      const res = await fetch(`/api/karir?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', message: 'Data karir berhasil dihapus.' });
        fetchKarir();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Gagal menghapus karir.' });
    }
  };

  const filteredKarir = karirList.filter(k =>
    k.profesi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.industri.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Master Data Karir &amp; Profesi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Katalog Profesi &amp; Kualifikasi Kerja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data referensi prospek kerja nyata yang dihubungkan ke jurusan kuliah melalui modul Career Linker.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> Tambah Karir Baru
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
            placeholder="Cari profesi atau industri..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredKarir.map(k => (
          <div key={k.id_karir} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    {k.industri}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {k.profesi}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(k)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(k.id_karir)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {k.deskripsi}
              </p>

              <div className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                <span>Gaji:</span>
                <span>{k.estimasi_gaji}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Prospek: <strong>{k.prospek_masa_depan}</strong></span>
              <span className="text-sky-700 font-bold">Terhubung ke Program Studi</span>
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
                {editingKarir ? 'Edit Data Profesi' : 'Tambah Profesi Karir Baru'}
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
                <label className="block font-bold text-slate-700 mb-1">Nama Profesi / Karir</label>
                <input
                  type="text"
                  required
                  value={formData.profesi}
                  onChange={e => setFormData({ ...formData, profesi: e.target.value })}
                  placeholder="Contoh: Cybersecurity Analyst"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sektor Industri</label>
                  <input
                    type="text"
                    required
                    value={formData.industri}
                    onChange={e => setFormData({ ...formData, industri: e.target.value })}
                    placeholder="Contoh: Teknologi Informasi, Finansial"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prospek Masa Depan</label>
                  <select
                    value={formData.prospek_masa_depan}
                    onChange={e => setFormData({ ...formData, prospek_masa_depan: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                  >
                    <option value="Sangat Tinggi">Sangat Tinggi</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Stabil">Stabil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimasi Rentang Gaji (Indonesia)</label>
                <input
                  type="text"
                  required
                  value={formData.estimasi_gaji}
                  onChange={e => setFormData({ ...formData, estimasi_gaji: e.target.value })}
                  placeholder="Contoh: Rp 8.000.000 - Rp 25.000.000 / bulan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kualifikasi &amp; Skill Utama (Pisahkan Koma)</label>
                <input
                  type="text"
                  required
                  value={formData.kualifikasi_utama}
                  onChange={e => setFormData({ ...formData, kualifikasi_utama: e.target.value })}
                  placeholder="Contoh: Kriptografi, Jaringan, Penetration Testing"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Peran &amp; Tanggung Jawab</label>
                <textarea
                  rows={3}
                  required
                  value={formData.deskripsi}
                  onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Uraian tanggung jawab harian profesi..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
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
                  className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow transition"
                >
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

