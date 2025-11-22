import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Get username and new password from command line arguments
  const username = process.argv[2]
  const newPassword = process.argv[3]

  if (!username || !newPassword) {
    console.log('❌ Usage: npx tsx prisma/change-password.ts <username> <new-password>')
    console.log('\nExample:')
    console.log('  npx tsx prisma/change-password.ts admin MyNewPassword123')
    process.exit(1)
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Update the user's password
  try {
    const user = await prisma.user.update({
      where: { username },
      data: { password: hashedPassword },
    })

    console.log(`✅ Password updated successfully for user: ${user.username}`)
    console.log(`   Role: ${user.role}`)
    console.log(`\n🔐 You can now login with:`)
    console.log(`   Username: ${user.username}`)
    console.log(`   Password: ${newPassword}`)
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.log(`❌ User "${username}" not found.`)
      console.log('\nAvailable users: admin, user1, user2')
    } else {
      console.log('❌ Error updating password:', error.message)
    }
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
