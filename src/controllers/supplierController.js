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
    await prisma.supplier.delete({
      where: { id: parseInt(id) }
    })
    res.status(204).send('Supplier deleted successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while deleting the supplier')
  }
  // add validator to see if user exists or not and send error
}

module.exports = {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
}
