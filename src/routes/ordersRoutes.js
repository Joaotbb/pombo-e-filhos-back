const express = require('express')
const {} = require('../controllers/authController')
const {
  getAllOrders,
  getOrder,
  createOrder
} = require('../controllers/ordersController')

const router = express.Router()

router.get('/orders', getAllOrders)
router.get('/orders/:id', getOrder)


router.post('/orders', createOrder)

module.exports = router
