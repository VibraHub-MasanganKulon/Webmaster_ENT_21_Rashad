'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Import Link untuk navigasi

// Definisi tipe data untuk berita
interface NewsItem {
  id: number;
  title: string;
  author: string;
  date: string;
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  clicks: number;
  ctr: number;
  mediaType: 'image' | 'video' | 'hybrid';
  thumbnail?: string;
}

export default function NewsManagementPage() {
  // State untuk pencarian dan filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Data dummy
  const newsData: NewsItem[] = [
    {
      id: 1,
      title: 'Luncurkan Mobil Listrik Pintar Terbaru Generasi Ke-3',
      author: 'Editor Tim',
      date: '4 Sep 2026',
      status: 'published',
      views: 1240,
      clicks: 186,
      ctr: 15.00,
      mediaType: 'hybrid',
      thumbnail: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=200&q=80', // Ganti URL dummy agar gambar muncul
    },
    {
      id: 2,
      title: 'Tips Mengoptimalkan Konten Digital untuk Bisnis F&B',
      author: 'Risky Content',
      date: '3 Sep 2026',
      status: 'draft',
      views: 0,
      clicks: 0,
      ctr: 0,
      mediaType: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=80',
    },
  ];

  // Handler untuk edit berita
  const handleEdit = (id: number) => {
    console.log('Edit news with ID:', id);
  };

  // Handler untuk hapus berita
  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      console.log('Delete news with ID:', id);
    }
  };

  // Format angka dengan separator
  const formatNumber = (num: number): string => {
    return num.toLocaleString('id-ID');
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: NewsItem['status'] }) => {
    const statusConfig = {
      published: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Published',
      },
      draft: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        label: 'Draft',
      },
      scheduled: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        label: 'Scheduled',
      },
    };

    const config = statusConfig[status];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
        {config.label}
      </span>
    );
  };

  // Media type badge component
  const MediaTypeBadge = ({ type }: { type: NewsItem['mediaType'] }) => {
    const labels = {
      image: 'Image',
      video: 'Video',
      hybrid: 'Hybrid',
    };

    return (
      <span className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm text-[10px] text-white px-1.5 py-0.5 rounded font-medium z-10">
        {labels[type]}
      </span>
    );
  };

  return (
    // PERBAIKAN 1: Hapus padding & background di sini. Biarkan kosong agar menyatu dengan AdminLayout
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Berita</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola konten teks, gambar, video, dan pantau performa CTR artikel Anda.
          </p>
        </div>
        
        {/* PERBAIKAN 2: Gunakan Next.js Link untuk navigasi SPA yang benar */}
        <Link 
          href="/admin/posts/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Berita Baru
        </Link>
      </div>

      {/* Filter & Pencarian Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Cari judul berita..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all" 
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Tabel CRUD Berita */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Informasi Berita</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Views</th>
                <th className="px-6 py-4 text-center">Clicks</th>
                <th className="px-6 py-4 text-center">CTR</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {newsData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">Belum ada berita</p>
                    </div>
                  </td>
                </tr>
              ) : (
                newsData.map((news) => (
                  <tr key={news.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Thumbnail Container */}
                        <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 relative">
                          <MediaTypeBadge type={news.mediaType} />
                          {news.thumbnail ? (
                            <img 
                              src={news.thumbnail} 
                              className="w-full h-full object-cover" 
                              alt="Thumbnail" 
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                          )}
                        </div>
                        
                        <div className="max-w-md">
                          <Link href={`/admin/posts/${news.id}/edit`} className="font-semibold text-slate-900 hover:text-blue-600 block truncate transition-colors">
                            {news.title}
                          </Link>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            Oleh: {news.author} • {news.date}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={news.status} />
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-600">
                      {formatNumber(news.views)}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-600">
                      {formatNumber(news.clicks)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs">
                        {news.ctr.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(news.id)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(news.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Hapus"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}