import { prisma } from '@/lib/prisma'

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

/** Pastikan slug unik — kalau sudah ada, tambahkan suffix angka */
async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title)
  let slug = base
  let counter = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } })
    if (!existing) return slug
    slug = `${base}-${counter}`
    counter += 1
  }
}

export type PostMediaInput = {
  mediaId: string
  subtitleUrl?: string | null
}

export type CreatePostInput = {
  title: string
  caption?: string | null
  contentText: string
  status: 'draft' | 'published' | 'scheduled'
  authorId: string
  featuredImageId?: string | null
  categoryId?: number | null
  mediaItems?: PostMediaInput[] // gambar/video tambahan dari media library, urutan = sort_order
  publishedAt?: Date | null
}

/**
 * Membuat post + relasi post_media dalam satu transaction.
 * Kalau salah satu gagal (mis. mediaId tidak valid), semuanya di-rollback.
 */
export async function createPostWithMedia(data: CreatePostInput) {
  const slug = await generateUniqueSlug(data.title)

  return prisma.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        title: data.title,
        slug,
        caption: data.caption || null,
        contentText: data.contentText,
        status: data.status,
        authorId: data.authorId,
        featuredImageId: data.featuredImageId || null,
        categoryId: data.categoryId || null,
        publishedAt:
          data.status === 'published' ? new Date() : data.publishedAt ?? null,
      },
    })

    if (data.mediaItems && data.mediaItems.length > 0) {
      await tx.postMedia.createMany({
        data: data.mediaItems.map((item, index) => ({
          postId: post.id,
          mediaId: item.mediaId,
          sortOrder: index,
          subtitleUrl: item.subtitleUrl ?? null,
        })),
      })
    }

    return post
  })
}

export async function getAllPostsForAdmin() {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      featuredImage: true,
      category: true,
      media: { include: { media: true } },
    },
  })
}

export async function getPostByIdForAdmin(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      featuredImage: true,
      category: true,
      media: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
    },
  })
}

// ---------- PUBLIC SITE (tetap dipakai halaman publik yang sudah jadi) ----------

export async function getFeaturedPost() {
  return prisma.post.findFirst({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    include: { featuredImage: true, author: true, category: true },
  })
}

export async function getLatestPosts(limit = 8, excludeId?: string) {
  return prisma.post.findMany({
    where: {
      status: 'published',
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: { featuredImage: true, author: true, category: true },
  })
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      featuredImage: true,
      author: true,
      media: { orderBy: { sortOrder: 'asc' }, include: { media: true } },
      category: true,
    },
  })
}
