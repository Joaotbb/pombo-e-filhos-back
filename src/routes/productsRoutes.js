const express = require('express')
const {
  getAllProducts,
  getAllProductsBySupplier,
  getAllProductsByClient,
  getProduct,
  getProductStock,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productsController')
const router = express.Router()

router.get('/products', getAllProducts)
router.get('/products/supplier/:supplierId', getAllProductsBySupplier)
router.get('/products/client/:clientId', getAllProductsByClient)
router.get('/products/stock/:productId', getProductStock)
router.get('/products/:id', getProduct)
router.post('/products', createProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

module.exports = router
