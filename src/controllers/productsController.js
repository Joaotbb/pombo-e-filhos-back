const { PrismaClient } = require('@prisma/client')
const asyncHandler = require('../middlewares/asyncHandler')

const prisma = new PrismaClient()

// Get all Products
const getAllProducts = asyncHandler(async (req, res) => {
  const allProducts = await prisma.product.findMany({})
  res.send(allProducts)
})

// Get a single supplier by ID
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params

  const oneProduct = await prisma.product.findUnique({
    where: { id: Number(id) }
  })

  if (oneProduct) {
    res.status(200).json({ success: true, oneProduct })
  } else {
    throw new Error('Product not found')
  }
})

// Create new Product
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, serialNumber, price, stock, suppliers } = req.body

  // Variable to get all Suppliers ID's not existing
  const notFoundSuppliers = []

  for (const supplier of suppliers.connect) {
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: supplier.id }
    })
    if (!existingSupplier) {
      notFoundSuppliers.push(supplier.id)
    }
  }

  if (notFoundSuppliers.length > 0) {
    throw new Error('Suppliers not found: ' + notFoundSuppliers.join(', '))
  }

  // Simplified validation TODO: could be further refined)
  if (!name || !description || !serialNumber || !price) {
    throw new Error('Missing required fields')
  }

  // CHECK IF THE SERIAL NUMBER EXISTES ON DB
  const existingProductBySN = await prisma.product.findUnique({
    where: { serialNumber: serialNumber }
  })

  if (existingProductBySN) {
    return res.status(400).json({ error: 'Serial Number already exists.' })
  }

  // IF PASSES THROUGH VALIDATION, CREATE PRODUCT
  const newProduct = await prisma.product.create({
    data: req.body
  })
  res.status(201).json({ success: true, newProduct })
})

// Update Product
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) }
  })

  if (!product) {
    throw new Error('Product with ID ' + id + ' not found')
  }

  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(product.id) },
    data: req.body
  })

  res.status(200).json({ success: true, updatedProduct })
})

// Delete a Product
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) }
  })

  if (!product) {
    throw new Error('Product not found')
  }

  await prisma.product.delete({
    where: { id: parseInt(id) }
  })

  res.status(200).send('Product deleted successfully')
})

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}
