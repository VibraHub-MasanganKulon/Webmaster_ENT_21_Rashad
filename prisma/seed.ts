import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

async function main() {
  // --- 1. Roles WAJIB dibuat dulu sebelum dipakai di bawah ---
  const roleNames = ['super_admin', 'editor', 'copywriter']
  for (const name of roleNames) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'super_admin' } })
  const editorRole = await prisma.role.findUniqueOrThrow({ where: { name: 'editor' } })
  const copywriterRole = await prisma.role.findUniqueOrThrow({ where: { name: 'copywriter' } })

  // --- 2. Users ---
  const defaultPasswordHash = await bcrypt.hash('ChangeMe123!', 10)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      roleId: superAdminRole.id,
      name: 'Super Admin',
      email: 'admin@example.com',
      passwordHash: defaultPasswordHash,
    },
  })

  const editor = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      roleId: editorRole.id,
      name: 'Budi Editor',
      email: 'editor@example.com',
      passwordHash: defaultPasswordHash,
    },
  })

  const copywriter = await prisma.user.upsert({
    where: { email: 'copywriter@example.com' },
    update: {},
    create: {
      roleId: copywriterRole.id,
      name: 'Sari Copywriter',
      email: 'copywriter@example.com',
      passwordHash: defaultPasswordHash,
    },
  })

  // --- 3. Categories ---
  const categoryNames = ['Teknologi', 'Bisnis', 'Olahraga', 'Lifestyle']
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: slugify(name) },
    })
  }
  const teknologiCategory = await prisma.category.findUniqueOrThrow({ where: { name: 'Teknologi' } })

  // --- 4. Sample Posts (featuredImageId null dulu — belum ada media) ---
  const samplePosts = [
    {
      title: 'Pemerintah Umumkan Kebijakan Baru Soal Transportasi Publik',
      caption: 'Rencana perluasan jalur transportasi umum di kota besar',
      contentText:
        'Pemerintah tengah menyusun rencana perluasan jalur transportasi publik di sejumlah kota besar untuk mengurangi kemacetan.',
      status: 'published',
      authorId: editor.id,
      categoryId: teknologiCategory.id,
      publishedAt: new Date('2026-08-20T08:00:00Z'),
      viewCount: 1240,
    },
    {
      title: '[Draft] Analisis Tren Ekonomi Digital Kuartal Ini',
      caption: null,
      contentText: 'Draf analisis mengenai tren ekonomi digital masih dalam proses penyusunan.',
      status: 'draft',
      authorId: superAdmin.id,
      categoryId: null,
      publishedAt: null,
      viewCount: 0,
    },
    {
      title: 'Startup Lokal Kembangkan Solusi Pertanian Berbasis Sensor',
      caption: null,
      contentText:
        'Sebuah startup teknologi lokal memperkenalkan alat berbasis sensor untuk memantau kelembapan tanah secara real-time.',
      status: 'published',
      authorId: copywriter.id,
      categoryId: teknologiCategory.id,
      publishedAt: new Date('2026-08-25T14:00:00Z'),
      viewCount: 856,
    },
  ]

  for (const post of samplePosts) {
    const slug = slugify(post.title)
    await prisma.post.upsert({
      where: { slug },
      update: {},
      create: {
        title: post.title,
        slug,
        caption: post.caption,
        contentText: post.contentText,
        featuredImageId: null,
        categoryId: post.categoryId,
        status: post.status,
        authorId: post.authorId,
        publishedAt: post.publishedAt,
        viewCount: post.viewCount,
      },
    })
  }

  console.log('Seed selesai: roles, users, categories, dan sample posts berhasil dibuat.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())
