const { PrismaClient } = require('@prisma/client')
const asyncHandler = require('../middlewares/asyncHandler')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

// Get all Orders
const getAllOrders = asyncHandler(async (req, res) => {
  const allOrders = await prisma.order.findMany({})
  res.send(allOrders)
})

// Get a single Order by ID
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

// Create a new Order
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
const updateStock = asyncHandler(async (req, res) => {
  const productToUpdate = await prisma.product.findUnique({
    where: { id: parseInt(req.params.productId) }
  })
  console.log(req.params.productId, req.params.stockValue)

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
  createOrder,
  updateStock,
  updateOrder,
  deleteOrder
}
