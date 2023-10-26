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

// PROTECT THIS ROUTES WITH USER ROLE = ADMIN
router.use(roleVerification)
router.post('/suppliers', createSupplier)
router.put('/suppliers/:id', updateSupplier)
router.delete('/suppliers/:id', deleteSupplier)

module.exports = router
