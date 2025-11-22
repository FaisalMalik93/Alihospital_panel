import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding users for authentication...\n')

  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  const users = await Promise.all([
    prisma.user.upsert({
      where: { username: 'admin' },
      update: { password: adminPassword },
      create: {
        username: 'admin',
        password: adminPassword,
        role: 'Admin',
      },
    }),
    prisma.user.upsert({
      where: { username: 'user1' },
      update: { password: userPassword },
      create: {
        username: 'user1',
        password: userPassword,
        role: 'User1',
      },
    }),
    prisma.user.upsert({
      where: { username: 'user2' },
      update: { password: userPassword },
      create: {
        username: 'user2',
        password: userPassword,
        role: 'User2',
      },
    }),
  ])

  console.log(`✅ Successfully created/updated ${users.length} users:\n`)
  console.log('   Username: admin   | Password: admin123  | Role: Admin')
  console.log('   Username: user1   | Password: user123   | Role: User1')
  console.log('   Username: user2   | Password: user123   | Role: User2')
  console.log('\n🔐 You can now login with these credentials!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
