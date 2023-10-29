const express = require('express')
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productsController')
const router = express.Router()

router.get('/products', getAllProducts)
router.get('/products/:id', getProduct)
router.post('/products', createProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

module.exports = router

