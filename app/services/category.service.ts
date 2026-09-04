import { prisma } from '@/lib/prisma'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { posts: true } } },
  })
}

export async function getCategoryById(id: number) {
  return prisma.category.findUnique({ where: { id } })
}

export type CreateCategoryInput = {
  name: string
  description?: string | null
}

export async function createCategory(data: CreateCategoryInput) {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description || null,
    },
  })
}

export async function updateCategory(id: number, data: CreateCategoryInput) {
  return prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description || null,
    },
  })
}

export async function deleteCategory(id: number) {
  // Post yang masih pakai kategori ini otomatis jadi categoryId = null
  // (karena relasi nullable), bukan ikut terhapus.
  return prisma.category.delete({ where: { id } })
}
