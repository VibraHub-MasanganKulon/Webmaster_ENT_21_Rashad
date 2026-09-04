import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canPublishDirectly } from '@/lib/rbac'
import { createPostWithMedia, getAllPostsForAdmin } from '@/services/post.service'

const postMediaSchema = z.object({
  mediaId: z.string().uuid(),
  subtitleUrl: z.string().url().nullable().optional(),
})

const createPostSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(200),
  caption: z.string().max(300).nullable().optional(),
  contentText: z.string().min(20, 'Konten minimal 20 karakter'),
  status: z.enum(['draft', 'published', 'scheduled']),
  featuredImageId: z.string().uuid().nullable().optional(),
  mediaItems: z.array(postMediaSchema).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const posts = await getAllPostsForAdmin()
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = (session.user as { role: string }).role
  const userId = (session.user as { id: string }).id

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
      contentText: data.contentText,
      status: finalStatus,
      authorId: userId,
      featuredImageId: data.featuredImageId,
      mediaItems: data.mediaItems,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Gagal membuat post:', error)
    return NextResponse.json({ error: 'Gagal menyimpan post' }, { status: 500 })
  }
}
