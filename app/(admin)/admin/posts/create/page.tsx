'use client';

import Link from 'next/link';
import React, { useState, ChangeEvent, FormEvent } from 'react';

// 1. Definisikan Tipe Data untuk State Form
type MediaFormat = 'image' | 'video' | 'hybrid';

interface PostFormData {
  title: string;
  slug: string;
  caption: string;
  contentText: string;
  mediaFormat: MediaFormat;
  videoUrl: string;
  categoryId: string;
  tags: string;
}

export default function CreatePostPage() {
  // 2. State Management untuk Form Utama
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    caption: '',
    contentText: '',
    mediaFormat: 'image',
    videoUrl: '',
    categoryId: '',
    tags: '',
  });

  // State tambahan untuk tracking loading state saat submit
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 3. Handler Fungsi Input Dinamis
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate slug sederhana jika yang diubah adalah judul berita
      if (name === 'title') {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter non-alphanumeric
          .replace(/\s+/g, '-');        // Ganti spasi dengan tanda hubung
      }
      
      return updated;
    });
  };

  const handleFormatChange = (format: MediaFormat) => {
    setFormData((prev) => ({ ...prev, mediaFormat: format }));
  };

  // 4. Handler Kirim Data (Submit ke API Endpoint posts Anda)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sesuai bagan gambar Anda, ini akan memicu route: api/posts/route.ts
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Gagal menyimpan berita');
      
      alert('Berita berhasil dipublikasikan!');
      // Anda bisa menambahkan router.push('/admin/posts') di sini jika memakai useRouter()
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-50 min-h-screen">
      {/* Top Navigation & Action Panel */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
            <Link 
                href="/admin/posts"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors inline-flex items-center justify-center"
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Buat Berita Baru</h1>
            <p className="text-xs text-slate-500">Isi data teks dan sematkan file multimedia Anda.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Simpan Draft
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Memproses...' : 'Publish Konten'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI (70%): Area Konten Utama */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Input Judul */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Utama Berita</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Masukkan judul berita yang menarik perhatian..." 
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-base font-medium focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all" 
            />
          </div>

          {/* Input Caption Singkat */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Caption Singkat (Untuk Feeds / Sosmed)</label>
            <textarea 
              name="caption"
              rows={3}
              value={formData.caption}
              onChange={handleInputChange}
              placeholder="Tulis caption singkat atau ringkasan berita di sini..." 
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
            ></textarea>
          </div>

          {/* Selector Tipe Media Berita Dinamis */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Format Lampiran Media</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Pilihan: Teks + Gambar */}
              <button
                type="button"
                onClick={() => handleFormatChange('image')}
                className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                  formData.mediaFormat === 'image' 
                    ? 'border-blue-500 bg-blue-50/40 text-blue-700' 
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-medium flex items-center gap-2">🖼️ Teks + Gambar</span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.mediaFormat === 'image' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                  {formData.mediaFormat === 'image' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>
              </button>

              {/* Pilihan: Teks + Video */}
              <button
                type="button"
                onClick={() => handleFormatChange('video')}
                className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                  formData.mediaFormat === 'video' 
                    ? 'border-blue-500 bg-blue-50/40 text-blue-700' 
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-medium flex items-center gap-2">🎥 Teks + Video</span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.mediaFormat === 'video' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                  {formData.mediaFormat === 'video' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>
              </button>

              {/* Pilihan: Hybrid */}
              <button
                type="button"
                onClick={() => handleFormatChange('hybrid')}
                className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                  formData.mediaFormat === 'hybrid' 
                    ? 'border-blue-500 bg-blue-50/40 text-blue-700' 
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-medium flex items-center gap-2">🧬 Hybrid (Keduanya)</span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.mediaFormat === 'hybrid' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                  {formData.mediaFormat === 'hybrid' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>
              </button>
            </div>

            {/* AREA MULTIMEDIA INPUT (Me-render form secara kondisional berdasarkan state format) */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              
              {/* Form Gambar: Ditampilkan jika memilih 'image' atau 'hybrid' */}
              {(formData.mediaFormat === 'image' || formData.mediaFormat === 'hybrid') && (
                <div className="animate-fadeIn">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Galeri Foto Berita</span>
                  <button 
                    type="button" 
                    className="w-full py-8 border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-xl transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <svg className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-slate-500 group-hover:text-blue-600 font-medium">Klik untuk upload gambar</span>
                    <span className="text-xs text-slate-400">PNG, JPG hingga 10MB</span>
                  </button>
                </div>
              )}

              {/* Form Video: Ditampilkan jika memilih 'video' atau 'hybrid' */}
              {(formData.mediaFormat === 'video' || formData.mediaFormat === 'hybrid') && (
                <div className="animate-fadeIn">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">URL Video</span>
                  <input 
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=... atau URL video lainnya"
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                  <p className="text-xs text-slate-400 mt-2">Support: YouTube, Vimeo, atau direct URL</p>
                </div>
              )}
            </div>
          </div>

          {/* Input Content Text */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Konten Lengkap</label>
            <textarea 
              name="contentText"
              rows={10}
              value={formData.contentText}
              onChange={handleInputChange}
              placeholder="Tulis konten berita lengkap di sini..." 
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
            ></textarea>
          </div>

        </div>

        {/* KOLOM KANAN (30%): Sidebar Settings */}
        <div className="space-y-6">
          
          {/* Kategori */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
            <select 
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
            >
              <option value="">Pilih Kategori</option>
              <option value="1">Teknologi</option>
              <option value="2">Bisnis</option>
              <option value="3">Lifestyle</option>
              <option value="4">Olahraga</option>
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
            <input 
              type="text" 
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="teknologi, startup, digital (pisahkan dengan koma)" 
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all" 
            />
          </div>

          {/* Slug Preview */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Slug URL</label>
            <div className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 font-mono">
              {formData.slug || 'judul-berita-anda'}
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}