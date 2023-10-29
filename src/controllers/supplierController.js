const { PrismaClient } = require('@prisma/client')
const asyncHandler = require('../middlewares/asyncHandler')

const prisma = new PrismaClient()

// Get all suppliers
const getAllSuppliers = asyncHandler(async (req, res) => {
  const allSuppliers = await prisma.supplier.findMany({})
  res.send(allSuppliers)
})

// Get a single supplier by ID
const getSupplier = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const oneSupplier = await prisma.supplier.findUnique({
    where: { id: Number(id) }
  })

  if (!oneSupplier) {
    throw new Error('Supplier not found')
  }

  res.status(200).json({ success: true, oneSupplier })
})

// Create a new supplier
const createSupplier = asyncHandler(async (req, res, next) => {
  const { name, address, company, email, phone } = req.body

  // TODO: refine in order to get personlized msgs for each error
  if (!name || !address || !company || !phone) {
    throw new Error('Required fields are missing')
  }

  const existingSupplierByPhone = await prisma.supplier.findUnique({
    where: { phone: phone }
  })

  if (existingSupplierByPhone) {
    throw new Error('Phone number already exists.')
  }

  const emailRegex = /\S+@\S+\.\S+/
  if (!email) {
    throw new Error('Email is required')
  } else if (!emailRegex.test(email)) {
    throw new Error('Email is not valid')
  }

  const existingSupplierByEmail = await prisma.supplier.findUnique({
    where: { email: email }
  })

  if (existingSupplierByEmail) {
    throw new Error('Email already exists.')
  }

  const newSupplier = await prisma.supplier.create({
    data: req.body
  })

  res.status(201).json({ success: true, newSupplier })
})

// Update a supplier
const updateSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params
  const supplier = await prisma.supplier.findUnique({
    where: { id: parseInt(id) }
  })

  if (!supplier) {
    throw new Error('Supplier not found')
  }

  const updatedSupplier = await prisma.supplier.update({
    where: { id: Number(id) },
    data: req.body
  })
  res.status(200).json({ success: true, updatedSupplier })
})

// Delete a supplier
const deleteSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params

  const supplier = await prisma.supplier.findUnique({
    where: { id: parseInt(id) }
  })

  if (!supplier) throw new Error('Supplier not found')

  await prisma.supplier.delete({
    where: { id: parseInt(id) }
  })
  res.status(200).send('Supplier deleted successfully')
})

module.exports = {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
}
