// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUserOrDefault } from '@/lib/session'
import { 
  getPostByIdForAdmin, 
  updatePostWithMedia, 
  deletePost 
} from '@/services/post.service'

const updatePostSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  caption: z.string().max(300).nullable().optional(),
  contentText: z.string().min(20).optional(),
  status: z.enum(['draft', 'published', 'scheduled']).optional(),
  featuredImageId: z.string().uuid().nullable().optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  mediaItems: z.array(z.object({
    mediaId: z.string().uuid(),
    subtitleUrl: z.string().url().nullable().optional(),
  })).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const post = await getPostByIdForAdmin(id)
  
  if (!post) {
    return NextResponse.json({ error: 'Post tidak ditemukan' }, { status: 404 })
  }
  
  return NextResponse.json(post)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getCurrentUserOrDefault()
  
  const body = await request.json()
  const parsed = updatePostSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validasi gagal', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const updatedPost = await updatePostWithMedia(id, {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
    })
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Gagal update post:', error)
    return NextResponse.json({ error: 'Gagal memperbarui post' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    await deletePost(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gagal hapus post:', error)
    return NextResponse.json({ error: 'Gagal menghapus post' }, { status: 500 })
  }
}