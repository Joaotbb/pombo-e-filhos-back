const auth = require('../middlewares/authMiddleware')
const express = require('express')

const {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController')
const roleVerification = require('../middlewares/roleMiddleware')
const router = express.Router()

router.use(auth) // PROTECT THIS ROUTES WITH AUTH TOKEN
router.get('/suppliers', getAllSuppliers)
router.get('/suppliers/:id', getSupplier)
router.post('/suppliers', roleVerification, createSupplier)
router.put('/suppliers/:id', roleVerification, updateSupplier)
router.delete('/suppliers/:id', roleVerification, deleteSupplier)

module.exports = router
