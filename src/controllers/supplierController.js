const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get all suppliers
const getAllSuppliers = async (req, res) => {
  const allSuppliers = await prisma.supplier.findMany({})
  res.send(allSuppliers)
}

// Get a single supplier by email
const getSupplier = async (req, res) => {
  try {
    const { id } = req.params

    const oneSupplier = await prisma.supplier.findUnique({
      where: { id: Number(id) }
    })

    if (oneSupplier) {
      res.json(oneSupplier)
    } else {
      res.status(404).send('Supplier not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while retrieving the supplier')
  }
}

// Create a new supplier
const createSupplier = async (req, res) => {
  try {
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
    res.status(201).json(newSupplier)
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while creating the supplier')
  }
}

// Update a supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) }
    })

    if (!supplier) return res.status(400).send('Supplier not found')

    const updatedSupplier = await prisma.supplier.update({
      where: { id: Number(id) },
      data: req.body
    })
    res.json(updatedSupplier)
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while updating the supplier')
  }
}


// Delete a supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params

    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) }
    })

    if (!supplier) return res.status(400).send('Supplier not found')

    await prisma.supplier.delete({
      where: { id: parseInt(id) }
    })
    res.status(204).send('Supplier deleted successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while deleting the supplier')
  }
}

module.exports = {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
}
