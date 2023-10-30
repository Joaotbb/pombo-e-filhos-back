const auth = require('../middlewares/authMiddleware')
const express = require('express')

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController')

const roleVerification = require('../middlewares/roleMiddleware')
const router = express.Router()

router.use(auth) // PROTECT THIS ROUTES WITH AUTH TOKEN
router.get('/users', getAllUsers)
router.get('/users/:id', getUser)

// PROTECT THIS ROUTES WITH USER ROLE = ADMIN
router.use(roleVerification)

router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

module.exports = router
