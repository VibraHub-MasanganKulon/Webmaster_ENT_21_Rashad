// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

async function main() {
  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'super_admin' } })
  const editorRole = await prisma.role.findUniqueOrThrow({ where: { name: 'editor' } })
  const copywriterRole = await prisma.role.findUniqueOrThrow({ where: { name: 'copywriter' } })

  // --- Users ---
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

  // --- Sample Posts (featuredImageId sengaja null dulu) ---
  const samplePosts = [
    {
      title: 'Pemerintah Umumkan Kebijakan Baru Soal Transportasi Publik',
      caption: 'Rencana perluasan jalur transportasi umum di kota besar',
      contentText:
        'Pemerintah tengah menyusun rencana perluasan jalur transportasi publik di sejumlah kota besar untuk mengurangi kemacetan. Rencana ini mencakup penambahan armada dan perluasan rute yang menjangkau kawasan pinggiran.',
      status: 'published',
      authorId: editor.id,
      publishedAt: new Date('2026-08-20T08:00:00Z'),
      viewCount: 1240,
    },
    {
      title: 'Tim Nasional Menang Telak di Laga Persahabatan',
      caption: 'Kemenangan meyakinkan jelang turnamen regional',
      contentText:
        'Tim nasional berhasil meraih kemenangan meyakinkan dalam laga persahabatan yang digelar akhir pekan lalu. Pelatih menyebut hasil ini sebagai modal positif menjelang turnamen regional mendatang.',
      status: 'published',
      authorId: copywriter.id,
      publishedAt: new Date('2026-08-22T10:30:00Z'),
      viewCount: 3021,
    },
    {
      title: 'Startup Lokal Kembangkan Solusi Pertanian Berbasis Sensor',
      caption: null,
      contentText:
        'Sebuah startup teknologi lokal memperkenalkan alat berbasis sensor yang membantu petani memantau kelembapan tanah secara real-time. Inovasi ini diharapkan dapat meningkatkan efisiensi penggunaan air di lahan pertanian.',
      status: 'published',
      authorId: editor.id,
      publishedAt: new Date('2026-08-25T14:00:00Z'),
      viewCount: 856,
    },
    {
      title: 'Festival Kuliner Tahunan Kembali Digelar Bulan Depan',
      caption: 'Ratusan tenant kuliner lokal akan berpartisipasi',
      contentText:
        'Festival kuliner tahunan dijadwalkan kembali digelar bulan depan dengan partisipasi ratusan tenant kuliner lokal. Panitia menyebut acara tahun ini akan menghadirkan lebih banyak zona interaktif untuk pengunjung.',
      status: 'scheduled',
      authorId: copywriter.id,
      publishedAt: new Date('2026-09-15T09:00:00Z'),
      viewCount: 0,
    },
    {
      title: '[Draft] Analisis Tren Ekonomi Digital Kuartal Ini',
      caption: null,
      contentText:
        'Draf analisis mengenai tren ekonomi digital masih dalam proses penyusunan, mencakup data pertumbuhan sektor e-commerce dan adopsi pembayaran digital di berbagai wilayah.',
      status: 'draft',
      authorId: superAdmin.id,
      publishedAt: null,
      viewCount: 0,
    },
  ]

  for (const post of samplePosts) {
    await prisma.post.upsert({
      where: { slug: slugify(post.title) },
      update: {},
      create: {
        title: post.title,
        slug: slugify(post.title),
        caption: post.caption,
        contentText: post.contentText,
        featuredImageId: null, // sengaja null dulu, isi kalau media library sudah ada
        status: post.status,
        authorId: post.authorId,
        publishedAt: post.publishedAt,
        viewCount: post.viewCount,
      },
    })
  }

  console.log('Seed selesai: roles, users, dan sample posts berhasil dibuat.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())

  