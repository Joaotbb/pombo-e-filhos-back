const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const bcrypt = require('bcrypt')

async function hashPassword(password) {
  return await bcrypt.hash(password, 10)
}

async function seedUsers() {
  // import users.json
  const usersData = JSON.parse(
    fs.readFileSync(`${__dirname}/./data/users.json`, 'utf-8')
  )

  for (const userData of usersData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (existingUser) {
      console.log('User already exists:', existingUser)
    } else {
      // Hash the password before saving to the database
      userData.password = await hashPassword(userData.password)
      const newUser = await prisma.user.create({
        data: userData
      })

      console.log('User created:', newUser)
    }
  }
}

async function seedProducts() {
  return 'teste'
}

async function main() {
  try {
    await seedUsers()
    await seedProducts()
  } catch (error) {
    console.error('Error seeding user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
