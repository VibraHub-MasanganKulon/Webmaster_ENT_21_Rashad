import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUserOrDefault } from '@/lib/session'
import { canPublishDirectly } from '@/lib/rbac'
import { createPostWithMedia, getAllPostsForAdmin } from '@/services/post.service'

const postMediaSchema = z.object({
  mediaId: z.string().uuid(),
  subtitleUrl: z.string().url().nullable().optional(),
})

const createPostSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(200),
  caption: z.string().max(300).nullable().optional(),
  contentText: z.string().min(20, 'Konten minimal 20 karakter').optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  featuredImageId: z.string().uuid().nullable().optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  mediaItems: z.array(postMediaSchema).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
})

export async function GET() {
  // Auth belum di-enforce (mode tes coding) — lihat catatan di src/lib/session.ts
  const posts = await getAllPostsForAdmin()
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const userData = {
    id: "4309cbdd-efe0-49d8-8ce6-759f6888a4c1",
    name: "Super Admin",
    email: "admin@example.com",
    role: 1,
  }
  const user = userData
  const role = "super_admin"
  const userId = "4309cbdd-efe0-49d8-8ce6-759f6888a4c1"

  const body = await request.json()
  const parsed = createPostSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validasi gagal', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data

  // RBAC: copywriter tidak boleh langsung publish, otomatis di-downgrade ke draft
  const finalStatus =
    data.status === 'published' && !canPublishDirectly(role) ? 'draft' : data.status

  try {
    const post = await createPostWithMedia({
      title: data.title,
      caption: data.caption,
      contentText: data.contentText!,
      status: finalStatus,
      authorId: userId,
      featuredImageId: data.featuredImageId,
      categoryId: data.categoryId,
      mediaItems: data.mediaItems,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Gagal membuat post:', error)
    return NextResponse.json({ error: 'Gagal menyimpan post' }, { status: 500 })
  }
}
