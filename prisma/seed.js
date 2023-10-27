const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')
const bcrypt = require('bcrypt')
const products = require('./data/products')

// TODO: this function will be a util --- pass to a controller
async function hashPassword(password) {
  return await bcrypt.hash(password, 10)
}

async function seedUsers() {
  // import users.json
  const usersData = JSON.parse(
    fs.readFileSync(`${__dirname}/./data/users.json`, 'utf-8')
  )
  // delete all useres before running
  await prisma.user.deleteMany({})

  for (const userData of usersData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (existingUser) {
      console.log('User already exists:', existingUser)
    } else {
      //   Hash the password before saving to the database
      userData.password = await hashPassword(userData.password)
      const newUser = await prisma.user.create({
        data: userData
      })

      console.log('User created:', newUser)
    }
  }
}

async function seedSuppliers() {
  const suppliersData = JSON.parse(
    fs.readFileSync(`${__dirname}/./data/suppliers.json`, 'utf-8')
  )

  // await prisma.supplier.deleteMany({})

  for (const supplierData of suppliersData) {
    const existingSupplier = await prisma.supplier.findUnique({
      where: { email: supplierData.email }
    })

    if (existingSupplier) {
      console.log('Supplier already exists:', existingSupplier)
    } else {
      const newSupplier = await prisma.supplier.create({
        data: supplierData
      })

      console.log('Supplier created:', newSupplier)
    }
  }
}

async function seedProducts() {
  const productsData = products

  // Uncomment if you want to delete all products before running
  // await prisma.product.deleteMany({});

  for (const productData of productsData) {
    const newProduct = await prisma.product.create({
      data: productData
    })

    console.log('Product created:', newProduct)
  }
}

async function main() {
  try {
    // await seedUsers()
    // await seedSuppliers()
    await seedProducts()
  } catch (error) {
    console.error('Error seeding user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
