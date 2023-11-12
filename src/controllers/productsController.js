const { PrismaClient } = require('@prisma/client')
const asyncHandler = require('../middlewares/asyncHandler')

const prisma = new PrismaClient()

// Get all Products
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: An array of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const allProducts = await prisma.product.findMany({})
  res.send(allProducts)
})

// Get all Products By Supplier
/**
 * @swagger
 * /products/supplier/{supplierId}:
 *   get:
 *     summary: Get all products by supplier
 *     description: Retrieve a list of products associated with a specific supplier.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the supplier to retrieve products for
 *     responses:
 *       200:
 *         description: An array of products for the specified supplier.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found for this supplier.
 */
const getAllProductsBySupplier = asyncHandler(async (req, res) => {
  const { supplierId } = req.params

  const products = await prisma.product.findMany({
    where: {
      suppliers: {
        some: {
          id: Number(supplierId)
        }
      }
    },
    include: {
      suppliers: true // Info about suppliers on result
    }
  })

  if (products && products.length > 0) {
    res.status(200).json({ success: true, products })
  } else {
    throw new Error('No products found for this supplier')
  }
})

//Get all Products By Client
/**
 * @swagger
 * /products/client/{clientId}:
 *   get:
 *     summary: Get all products by client
 *     description: Retrieve a list of products that a specific client has ordered.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the client to retrieve products for
 *     responses:
 *       200:
 *         description: An array of products ordered by the specified client.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client:
 *                   $ref: '#/components/schemas/User'
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found for this client.
 */
const getAllProductsByClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params

  //Find Orders associated to the client
  const orders = await prisma.order.findMany({
    where: {
      userId: Number(clientId),
      user: {
        role: 'CLIENT'
      }
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          address: true,
          email: true,
          role: true
        }
      }
    }
  })

  if (orders && orders.length > 0) {
    // Extract products from all orders
    const products = orders.flatMap((order) =>
      order.orderItems.map((item) => item.product)
    )
    const clientInfo = orders[0].user
    res.status(200).json({ success: true, client: clientInfo, products })
  } else {
    throw new Error('No products found for this client')
  }
})

// Get a single product by ID
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     description: Get a specific product by its unique ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique id of the product to get
 *     responses:
 *       200:
 *         description: A single product object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found.
 */
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

//Get Product in stock
/**
 * @swagger
 * /products/stock/{productId}:
 *   get:
 *     summary: Get product stock information
 *     description: Retrieve the stock information for a specific product.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the product to retrieve stock for
 *     responses:
 *       200:
 *         description: Product stock information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 stock:
 *                   type: integer
 *                 suppliers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Product not found.
 */
const getProductStock = asyncHandler(async (req, res) => {
  const { productId } = req.params // Get ID product from query params

  // Search Product by ID
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
    include: {
      suppliers: true // Info about suppliers of the product
    }
  })

  if (product) {
    const stockInfo = {
      productId: product.id,
      name: product.name,
      description: product.description,
      stock: product.stock, // Product stock
      suppliers: product.suppliers // Info from suppliers
    }

    res.status(200).json({ success: true, stockInfo })
  } else {
    throw new Error('Product not found')
  }
})

// Create new Product
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the database.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Serial Number already exists or missing required fields.
 *       404:
 *         description: Suppliers not found.
 */
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
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Update product details in the database.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product with the specified ID not found.
 */
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
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Remove a product from the database.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 */
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
  getAllProductsBySupplier,
  getAllProductsByClient,
  getProduct,
  getProductStock,
  createProduct,
  updateProduct,
  deleteProduct
}
