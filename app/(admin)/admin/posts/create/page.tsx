'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import MediaPickerModal, { PickedMedia } from '@/components/admin/MediaPickerModal'

type MediaFormat = 'image' | 'video' | 'hybrid'

type CategoryOption = { id: number; name: string }

interface PostFormData {
  title: string
  slug: string
  caption: string
  contentText: string
  mediaFormat: MediaFormat
  categoryId: string
}

export default function CreatePostPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    caption: '',
    contentText: '',
    mediaFormat: 'image',
    categoryId: '',
  })

  const [categories, setCategories] = useState<CategoryOption[]>([])

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        // Kalau API mengembalikan error object (mis. 401 Unauthorized),
        // `data` bukan array — jangan langsung di-set, biar tidak bikin .map() crash
        if (Array.isArray(data)) {
          setCategories(data)
        } else {
          console.error('Respons /api/categories bukan array:', data)
          setCategories([])
        }
      })
      .catch((err) => {
        console.error('Gagal fetch categories:', err)
        setCategories([])
      })
  }, [])

  // Media dipilih dari Media Library (bukan upload langsung di form ini)
  const [selectedImages, setSelectedImages] = useState<PickedMedia[]>([])
  const [selectedVideos, setSelectedVideos] = useState<PickedMedia[]>([])
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null)

  const [pickerOpen, setPickerOpen] = useState<'image' | 'video' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === 'title') {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
      }
      return updated
    })
  }

  function handleFormatChange(format: MediaFormat) {
    setFormData((prev) => ({ ...prev, mediaFormat: format }))
  }

  function handleImagesPicked(items: PickedMedia[]) {
    setSelectedImages(items)
    // gambar pertama otomatis jadi featured image kalau belum ada yang dipilih
    if (items.length > 0 && !featuredImageId) {
      setFeaturedImageId(items[0].id)
    }
  }

  function removeImage(id: string) {
    setSelectedImages((prev) => prev.filter((i) => i.id !== id))
    if (featuredImageId === id) setFeaturedImageId(null)
  }

  function removeVideo(id: string) {
    setSelectedVideos((prev) => prev.filter((i) => i.id !== id))
  }

  async function submitPost(status: 'draft' | 'published') {
    setErrorMsg('')

    if (!formData.title || !formData.contentText) {
      setErrorMsg('Judul dan konten wajib diisi.')
      return
    }

    setIsSubmitting(true)

    // Gabungkan gambar (selain featured) + video jadi post_media, urutan = sort_order
    const galleryImages = selectedImages.filter((img) => img.id !== featuredImageId)
    const mediaItems = [
      ...galleryImages.map((m) => ({ mediaId: m.id })),
      ...selectedVideos.map((m) => ({ mediaId: m.id })),
    ]

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          caption: formData.caption || null,
          contentText: formData.contentText,
          status,
          featuredImageId,
          categoryId: formData.categoryId ? Number(formData.categoryId) : null,
          mediaItems,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Gagal menyimpan berita')
      }

      router.push('/admin/posts')
      router.refresh()
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Terjadi kesalahan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    submitPost('published')
  }

  const showImageSection = formData.mediaFormat === 'image' || formData.mediaFormat === 'hybrid'
  const showVideoSection = formData.mediaFormat === 'video' || formData.mediaFormat === 'hybrid'

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
            <p className="text-xs text-slate-500">
              Pilih gambar/video dari Media Library — bukan upload manual di sini.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => submitPost('draft')}
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

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI (70%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Judul */}
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

          {/* Caption */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Caption Singkat</label>
            <textarea
              name="caption"
              rows={3}
              value={formData.caption}
              onChange={handleInputChange}
              placeholder="Tulis caption singkat atau ringkasan berita di sini..."
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Format Media */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Format Lampiran Media</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['image', 'video', 'hybrid'] as MediaFormat[]).map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => handleFormatChange(format)}
                  className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                    formData.mediaFormat === format
                      ? 'border-blue-500 bg-blue-50/40 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    {format === 'image' && '🖼️ Teks + Gambar'}
                    {format === 'video' && '🎥 Teks + Video'}
                    {format === 'hybrid' && '🧬 Hybrid (Keduanya)'}
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.mediaFormat === format ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    }`}
                  >
                    {formData.mediaFormat === format && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              {/* Gambar — dari Media Library */}
              {showImageSection && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Galeri Foto (dari Media Library)
                    </span>
                    <button
                      type="button"
                      onClick={() => setPickerOpen('image')}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      + Pilih Gambar
                    </button>
                  </div>

                  {selectedImages.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => setPickerOpen('image')}
                      className="w-full py-8 border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-xl transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                      <span className="text-sm text-slate-500 group-hover:text-blue-600 font-medium">
                        Klik untuk pilih gambar dari Media Library
                      </span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedImages.map((img) => (
                        <div key={img.id} className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.fileUrl} alt={img.fileName} className="h-20 w-full rounded-lg object-cover" />
                          {img.id === featuredImageId && (
                            <span className="absolute left-1 top-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] text-white">
                              Featured
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Video — dari Media Library */}
              {showVideoSection && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Video (dari Media Library)
                    </span>
                    <button
                      type="button"
                      onClick={() => setPickerOpen('video')}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      + Pilih Video
                    </button>
                  </div>

                  {selectedVideos.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => setPickerOpen('video')}
                      className="w-full py-8 border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-xl transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                      <span className="text-sm text-slate-500 group-hover:text-blue-600 font-medium">
                        Klik untuk pilih video dari Media Library
                      </span>
                    </button>
                  ) : (
                    <ul className="space-y-2">
                      {selectedVideos.map((vid) => (
                        <li
                          key={vid.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        >
                          <span>🎬 {vid.fileName}</span>
                          <button
                            type="button"
                            onClick={() => removeVideo(vid.id)}
                            className="text-red-500 hover:underline text-xs"
                          >
                            Hapus
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Konten */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Konten Lengkap</label>
            <textarea
              name="contentText"
              rows={10}
              value={formData.contentText}
              onChange={handleInputChange}
              required
              placeholder="Tulis konten berita lengkap di sini..."
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* KOLOM KANAN (30%) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
            >
              <option value="">Tanpa Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-2 text-xs text-slate-400">
                Belum ada kategori. Tambahkan lewat menu Kategori dulu.
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Slug URL</label>
            <div className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 font-mono">
              {formData.slug || 'judul-berita-anda'}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Preview saja — slug final & keunikannya ditentukan server saat disimpan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-xs text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">Catatan</p>
            <p>Tags belum tersedia karena belum ada di skema database.</p>
            <p>Penulis (author) otomatis diambil dari akun yang sedang login.</p>
          </div>
        </div>
      </div>

      <MediaPickerModal
        mediaType="image"
        isOpen={pickerOpen === 'image'}
        onClose={() => setPickerOpen(null)}
        onConfirm={handleImagesPicked}
        multiple
      />
      <MediaPickerModal
        mediaType="video"
        isOpen={pickerOpen === 'video'}
        onClose={() => setPickerOpen(null)}
        onConfirm={setSelectedVideos}
        multiple
      />
    </form>
  )
}
