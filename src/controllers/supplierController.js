const { PrismaClient } = require('@prisma/client')
const asyncHandler = require('../middlewares/asyncHandler')

const prisma = new PrismaClient()

// Get all suppliers
const getAllSuppliers = asyncHandler(async (req, res) => {
  const allSuppliers = await prisma.supplier.findMany({})
  res.send(allSuppliers)
})

// Get a single supplier by ID
const getSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params

  const oneSupplier = await prisma.supplier.findUnique({
    where: { id: Number(id) }
  })

  if (oneSupplier) {
    res.status(200).json({ success: true, oneSupplier })
  } else {
    res.status(404).send('Supplier not found')
  }

  res.status(500).send('An error occurred while retrieving the supplier')
})

// Create a new supplier
const createSupplier = asyncHandler(async (req, res) => {
  const { name, address, company, email, phone } = req.body

  // CREATE HANDLER TO SIMPLIFY CODE
  TODO: if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }

  if (!address) {
    return res.status(400).json({ error: 'Nickname is required' })
  }

  if (!company) {
    return res.status(400).json({ error: 'Name is required' })
  }

  if (!phone) {
    return res.status(400).json({ error: 'Phone is required' })
  }

  // CHECK IF THE PHONE EXISTES ON DB
  const existingSupplierByPhone = await prisma.supplier.findUnique({
    where: { phone: phone }
  })

  if (existingSupplierByPhone) {
    return res.status(400).json({ error: 'Phone number already exists.' })
  }

  const emailRegex = /\S+@\S+\.\S+/
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  } else if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email is not valid' })
  }

  // CHECK IF THE EMAIL EXISTES ON DB
  const existingSupplierByEmail = await prisma.supplier.findUnique({
    where: { email: email }
  })

  if (existingSupplierByEmail) {
    return res.status(400).json({ error: 'Email already exists.' })
  }

  // IF PASSES THROUGH VALIDATION, CREATE SUPPLIER
  const newSupplier = await prisma.supplier.create({
    data: req.body
  })
  res.status(201).json({ success: true, newSupplier })

  res.status(500).send('An error occurred while creating the supplier')
})

// Update a supplier
const updateSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params
  const supplier = await prisma.supplier.findUnique({
    where: { id: parseInt(id) }
  })

  if (!supplier) return res.status(400).send('Supplier not found')

  const updatedSupplier = await prisma.supplier.update({
    where: { id: Number(id) },
    data: req.body
  })
  res.status(200).json({ success: true, updatedSupplier })

  res.status(500).send('An error occurred while updating the supplier')
})

// Delete a supplier
const deleteSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params

  const supplier = await prisma.supplier.findUnique({
    where: { id: parseInt(id) }
  })

  if (!supplier) return res.status(400).send('Supplier not found')

  await prisma.supplier.delete({
    where: { id: parseInt(id) }
  })
  console.log('string')
  res.status(200).send('Supplier deleted successfully')

  res.status(500).send('An error occurred while deleting the supplier')
})

module.exports = {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
}
