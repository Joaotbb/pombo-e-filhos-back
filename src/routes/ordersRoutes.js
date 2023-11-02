const express = require('express')
const {} = require('../controllers/authController')
const {
  getAllOrders,
  getOrder,
  createOrder,
  updateStock
} = require('../controllers/ordersController')
const roleVerification = require('../middlewares/roleMiddleware')

const router = express.Router()

router.get('/orders', getAllOrders)
router.get('/orders/:id', getOrder)
router.post('/orders', createOrder)
router.put('/orders/:productId/:stockValue', roleVerification, updateStock)

module.exports = router
