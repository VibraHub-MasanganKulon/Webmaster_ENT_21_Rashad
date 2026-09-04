import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  return session.user as { id: string; name: string; email: string; role: string }
}

/**
 * SEMENTARA: dipakai selama auth belum di-enforce (project tes coding).
 * Kalau tidak ada session, fallback ke user super_admin pertama di database
 * (dari hasil seed) supaya authorId/uploadedBy tetap valid.
 *
 * ⚠️ Hapus fungsi ini dan pakai getCurrentUser() saja begitu auth
 * diaktifkan lagi — jangan sampai kebawa ke production.
 */
export async function getCurrentUserOrDefault() {
  const session = await getCurrentUser()
  if (session) return session

  const fallbackUser = await prisma.user.findFirst({
    where: { role: { name: 'super_admin' } },
    include: { role: true },
  })

  if (!fallbackUser) {
    throw new Error(
      'Tidak ada session dan tidak ada user super_admin di database. Jalankan `npx prisma db seed` dulu.'
    )
  }

  return {
    id: fallbackUser.id,
    name: fallbackUser.name,
    email: fallbackUser.email,
    role: fallbackUser.role.name,
  }
}
