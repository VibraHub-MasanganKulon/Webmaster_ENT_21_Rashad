import { NextResponse } from 'next/server'
import { z } from 'zod'
import { updateCategory, deleteCategory } from '@/services/category.service'

const updateCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(300).nullable().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const body = await request.json()
  const parsed = updateCategorySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validasi gagal', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const category = await updateCategory(Number(id), parsed.data)
    return NextResponse.json(category)
  } catch (error) {
    console.error('Gagal update kategori:', error)
    return NextResponse.json({ error: 'Gagal update kategori' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    await deleteCategory(Number(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gagal hapus kategori:', error)
    return NextResponse.json({ error: 'Gagal hapus kategori' }, { status: 500 })
  }
}
