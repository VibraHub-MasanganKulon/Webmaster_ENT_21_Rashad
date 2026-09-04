// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const roles = ['super_admin', 'editor', 'copywriter']

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  const superAdminRole = await prisma.role.findUniqueOrThrow({
    where: { name: 'super_admin' },
  })

  const passwordHash = await bcrypt.hash('ChangeMe123!', 10)

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      roleId: superAdminRole.id,
      name: 'Super Admin',
      email: 'admin@example.com',
      passwordHash,
    },
  })

  console.log('Seed selesai.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())