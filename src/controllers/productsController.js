const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get all Products
const getAllProducts = async (req, res) => {
  const allProducts = await prisma.product.findMany({})
  res.send(allProducts)
}

// Get a single supplier by ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params

    const oneProduct = await prisma.product.findUnique({
      where: { id: Number(id) }
    })

    if (oneProduct) {
      res.json(oneProduct)
    } else {
      res.status(404).send('Product not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while retrieving the supplier')
  }
}

// Create new Product
const createProduct = async (req, res) => {
  try {
    const { name, description, serialNumber, price, stock, suppliers } =
      req.body

    for (const supplier of suppliers.connect) {
      // console.log(supplier.id)
      const existingSupplier = await prisma.supplier.findUnique({
        where: { id: supplier.id }
      })
      if (!existingSupplier)
        return res.status(400).json(`Supplier ${supplier.id} does not exist `)
    }

    // CREATE HANDLER TO SIMPLIFY CODE
    TODO: if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    if (!description) {
      return res.status(400).json({ error: 'Description is required' })
    }

    if (!serialNumber) {
      return res.status(400).json({ error: 'Serial Number is required' })
    }

    if (!price) {
      return res.status(400).json({ error: 'Price is required' })
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
    res.status(201).json(newProduct)
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while creating the Product')
  }
}

// // Update Product
// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params
//     const product = await prisma.product.findUnique({
//       where: { id: parseInt(id) }
//     })

//     if (!product) return res.status(400).send('Product not found')

//     const updatedProduct = await prisma.product.update({
//       where: { id: Number(id) },
//       data: req.body
//     })
//     res.json(updatedProduct)
//   } catch (error) {
//     console.error(error)
//     res.status(500).send('An error occurred while updating the Product')
//   }
// }

// // Delete a Product
// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params

//     const product = await prisma.product.findUnique({
//       where: { id: parseInt(id) }
//     })

//     if (!product) return res.status(400).send('Product not found')

//     await prisma.product.delete({
//       where: { id: parseInt(id) }
//     })
//     res.status(204).send('Product deleted successfully')
//   } catch (error) {
//     console.error(error)
//     res.status(500).send('An error occurred while deleting the Product')
//   }
// }

module.exports = {
  getAllProducts,
  getProduct,
  createProduct
  // updateProduct,
  // deleteProduct
}
