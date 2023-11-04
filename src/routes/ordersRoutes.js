const express = require('express')
const {} = require('../controllers/authController')
const {
  getAllOrders,
  getOrder,
  createOrder,
  updateStock,
  deleteOrder,
  updateOrder
} = require('../controllers/ordersController')
const roleVerification = require('../middlewares/roleMiddleware')

const router = express.Router()

router.get('/orders', getAllOrders)
router.get('/orders/:id', getOrder)
router.post('/orders', createOrder)
router.put('/orders/:id', roleVerification, updateOrder)
router.put('/orders/:productId/:stockValue', roleVerification, updateStock)
router.delete('/orders/:id', deleteOrder)

module.exports = router
