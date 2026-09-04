import Link from 'next/link'
import { getAllCategories } from '@/services/category.service'

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Kategori Berita</h1>
          <p className="text-xs text-slate-500">Kelola kategori untuk pengelompokan berita.</p>
        </div>
        <Link
          href="/admin/categories/create"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          + Tambah Kategori
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-6 py-3">Nama</th>
              <th className="text-left px-6 py-3">Slug</th>
              <th className="text-left px-6 py-3">Jumlah Post</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                  Belum ada kategori. Klik &quot;Tambah Kategori&quot; untuk membuat yang pertama.
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/60">
                <td className="px-6 py-3 font-medium text-slate-800">{cat.name}</td>
                <td className="px-6 py-3 font-mono text-slate-500">{cat.slug}</td>
                <td className="px-6 py-3 text-slate-600">{cat._count.posts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
