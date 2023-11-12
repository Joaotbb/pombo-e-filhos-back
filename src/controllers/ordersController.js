const { PrismaClient } = require('@prisma/client')
const asyncHandler = require('../middlewares/asyncHandler')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

// Get all Orders
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of all orders.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const allOrders = await prisma.order.findMany({})
  res.send(allOrders)
})

// Get a single Order by ID
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     description: Retrieve details of a specific order by its ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Details of the order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found.
 */
const getOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const oneOrder = await prisma.order.findUnique({
    where: { id: Number(id) }
  })

  if (!oneOrder) {
    throw new Error('Order not found')
  }

  res.status(200).json({ success: true, oneOrder })
})

// Get Orders By date
/**
 * @swagger
 * /orders/date:
 *   get:
 *     summary: Get orders by date range
 *     description: Retrieve a list of orders within a specified start and end date.
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date for filtering orders (inclusive)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date for filtering orders (inclusive)
 *     responses:
 *       200:
 *         description: A list of orders within the specified date range.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid or missing date parameters.
 *       404:
 *         description: No orders found for the specified date range.
 */
const getOrdersByDate = asyncHandler(async (req, res) => {
  let { startDate, endDate } = req.params

  // Verify if dates are valid
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'You must provide both startDate and endDate query parameters'
    })
  }

  // Turn date's strings to Date objects
  startDate = new Date(startDate)
  endDate = new Date(endDate)

  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23, 59, 59, 999)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid startDate or endDate' })
  }

  const orders = await prisma.order.findMany({
    where: {
      created_at: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      orderItems: true,
      user: true,
      supplier: true
    }
  })

  if (!orders.length) {
    return res.status(404).json({
      success: false,
      message: 'No orders found for the specified date range'
    })
  }

  res.status(200).json({ success: true, data: orders })
})

// Create a new Order
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order and update product stock accordingly.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewOrder'
 *     responses:
 *       201:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: No token provided or invalid token.
 *       500:
 *         description: Server error or could not create order.
 */
const createOrder = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'No Token Provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
    const userId = decoded.id

    const { supplierId, status, orderType } = req.body

    const newOrder = await prisma.order.create({
      data: {
        userId,
        supplierId,
        status,
        orderType
      }
    })

    for (const product of req.body.products) {
      const productToUpdate = await prisma.product.findUnique({
        where: { id: parseInt(product.productId) }
      })

      console.info(productToUpdate.stock, 'Current stock')

      const finalStock = productToUpdate.stock - product.quantity

      console.info('Final stock here:', finalStock)

      await prisma.product.update({
        where: { id: parseInt(product.productId) },
        data: {
          stock: finalStock
        }
      })

      await prisma.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: product.productId,
          quantity: product.quantity,
          unitPrice: product.unitPrice
        }
      })
    }

    res.status(201).json({ success: true, newOrder })
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ success: false, message: 'Invalid Token' })
    } else {
      res.status(500).json({ success: false, message: 'Server Error' })
    }
  }
})

//Update Stock (like an order to supplier)
/**
 * @swagger
 * /orders/{productId}/{stockValue}:
 *   put:
 *     summary: Update product stock
 *     description: Updates the stock for a given product by the specified value (ex. restock).
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to update
 *       - in: path
 *         name: stockValue
 *         required: true
 *         schema:
 *           type: integer
 *         description: The value to add to the current stock
 *     responses:
 *       200:
 *         description: Product stock was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found.
 */
const updateStock = asyncHandler(async (req, res) => {
  const productToUpdate = await prisma.product.findUnique({
    where: { id: parseInt(req.params.productId) }
  })

  const newStock =
    parseInt(productToUpdate.stock) + parseInt(req.params.stockValue)

  await prisma.product.update({
    where: { id: parseInt(req.params.productId) },
    data: {
      stock: newStock
    }
  })
  res
    .status(200)
    .json({ success: true, message: 'Product stock was successfull updated' })
})

// Update Order
/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order
 *     description: Updates an existing order with the provided data.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found.
 */
const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) }
  })

  if (!order) {
    throw new Error('Order not found')
  }

  const updatedOrder = await prisma.order.update({
    where: { id: Number(id) },
    data: req.body
  })
  res.status(200).json({ success: true, updatedOrder })
})

// Delete Order
/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     description: Deletes the specified order along with its associated order items.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to delete
 *     responses:
 *       200:
 *         description: Order deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Order not found.
 */
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params
  const orderId = parseInt(id)

  // Check if the order exists
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  })

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }

  // Exclude all orderItems associated
  await prisma.orderItem.deleteMany({
    where: { orderId: orderId }
  })

  // After delete the order
  await prisma.order.delete({
    where: { id: orderId }
  })

  res.status(200).json({ success: true, message: 'Order deleted successfully' })
})

module.exports = {
  getAllOrders,
  getOrder,
  getOrdersByDate,
  createOrder,
  updateStock,
  updateOrder,
  deleteOrder
}
