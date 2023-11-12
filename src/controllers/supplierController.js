const { PrismaClient } = require('@prisma/client')
const asyncHandler = require('../middlewares/asyncHandler')

const prisma = new PrismaClient()

// Get all suppliers
/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Get all suppliers
 *     description: Retrieve a list of all suppliers.
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: An array of suppliers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
const getAllSuppliers = asyncHandler(async (req, res) => {
  const allSuppliers = await prisma.supplier.findMany({})
  res.send(allSuppliers)
})

// Get a single supplier by ID
/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     description: Get a specific supplier by their unique ID.
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique id of the supplier to get
 *     responses:
 *       200:
 *         description: A single supplier object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found.
 */
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
/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Create a new supplier
 *     description: Create a new supplier with the provided data.
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Required fields are missing or the phone/email is already in use.
 */
const createSupplier = asyncHandler(async (req, res, next) => {
  const { name, address, company, email, phone } = req.body

  if (!name) {
    return res.status(400).send({ error: 'Name is required' })
  }
  if (!address) {
    return res.status(400).send({ error: 'Address is required' })
  }
  if (!company) {
    return res.status(400).send({ error: 'Company is required' })
  }
  if (!phone) {
    return res.status(400).send({ error: 'Phone is required' })
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
/**
 * @swagger
 * /suppliers/{id}:
 *   put:
 *     summary: Update a supplier
 *     description: Update a supplier's information by their ID.
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id of the supplier to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully.
 *       404:
 *         description: Supplier not found.
 */
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
/**
 * @swagger
 * /suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     description: Delete a supplier by their ID.
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id of the supplier to delete
 *     responses:
 *       200:
 *         description: Supplier deleted successfully.
 *       404:
 *         description: Supplier not found.
 */
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
