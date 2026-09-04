// app/(admin)/admin/posts/[id]/edit/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface PostDetail {
  id: string
  title: string
  caption: string | null
  contentText: string
  status: 'draft' | 'published' | 'scheduled'
  featuredImageId: string | null
  categoryId: number | null
  author?: { name: string | null } | null
  category?: { id: number; name: string } | null
  featuredImage?: { url: string } | null
  media?: Array<{ mediaId: string; sortOrder: number; media: { url: string; type: string } }>
}

type CategoryOption = { id: number; name: string }

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [formData, setFormData] = useState<Partial<PostDetail>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch data post saat mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`)
        if (!res.ok) throw new Error('Gagal memuat data')
        const data: PostDetail = await res.json()
        setFormData(data)
      } catch (err) {
        setError('Gagal memuat data berita')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [id])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Gagal menyimpan perubahan')
      }

      alert('Berita berhasil diperbarui!')
      router.push('/admin/posts')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="p-8 text-center">Memuat data...</div>
  if (error && !formData.id) return <div className="p-8 text-red-600">{error}</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Berita</h1>
          <p className="text-sm text-slate-500">Perbarui konten dan pengaturan artikel.</p>
        </div>
        <Link href="/admin/posts" className="text-sm text-slate-600 hover:text-blue-600">
          ← Kembali ke Daftar
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        {/* Judul */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Judul Berita</label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Caption / Ringkasan</label>
          <textarea
            name="caption"
            rows={3}
            value={formData.caption || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Konten Utama */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Konten Lengkap</label>
          <textarea
            name="contentText"
            rows={12}
            value={formData.contentText || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {/* Status & Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status || 'draft'}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          
          {/* Placeholder untuk Kategori - sesuaikan dengan data kategori dari DB */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
            <select
              name="categoryId"
              value={formData.categoryId || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value ? Number(e.target.value) : null }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Image ID (Placeholder) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Featured Image ID</label>
          <input
            type="text"
            name="featuredImageId"
            value={formData.featuredImageId || ''}
            onChange={handleChange}
            placeholder="UUID dari media library"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {formData.featuredImage?.url && (
            <img src={formData.featuredImage.url} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded-lg border" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Link 
            href="/admin/posts"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  )
}