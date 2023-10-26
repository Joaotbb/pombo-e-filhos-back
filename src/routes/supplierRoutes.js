const express = require('express')
const {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController')
const router = express.Router()

router.get('/suppliers', getAllSuppliers)
router.get('/suppliers/:id', getSupplier)
router.post('/suppliers', createSupplier)
router.put('/suppliers/:id', updateSupplier)
router.delete('/suppliers/:id', deleteSupplier)

module.exports = router
