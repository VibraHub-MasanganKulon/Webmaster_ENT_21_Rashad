import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAllCategories, createCategory } from '@/services/category.service'

const createCategorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter').max(100),
  description: z.string().max(300).nullable().optional(),
})

export async function GET() {
  // Auth belum di-enforce (mode tes coding) — lihat catatan di src/lib/session.ts
  const categories = await getAllCategories()
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = createCategorySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validasi gagal', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const category = await createCategory(parsed.data)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    // unique constraint (nama/slug sudah ada) akan lempar error di sini
    console.error('Gagal membuat kategori:', error)
    return NextResponse.json(
      { error: 'Gagal menyimpan kategori — mungkin nama sudah dipakai' },
      { status: 500 }
    )
  }
}
