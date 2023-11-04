const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const asyncHandler = require('../middlewares/asyncHandler')

const prisma = new PrismaClient()

// Get all Users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the database. Can only be accessed by authenticated users with proper authorization.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, token missing or invalid.
 *       403:
 *         description: Forbidden, user is not allowed to access this resource.
 *       500:
 *         description: Internal server error.
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await prisma.user.findMany({})
  res.send(allUsers)
})

// Get a single User by ID
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Get a specific user by their unique ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique id of the user to get
 *     responses:
 *       200:
 *         description: A single user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 */
const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const oneUser = await prisma.user.findUnique({
    where: { id: Number(id) }
  })

  if (!oneUser) {
    throw new Error('User not found')
  }

  res.status(200).json({ success: true, oneUser })
})

// Create a new User
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided data.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Required fields are missing or the email is already in use.
 */
const createUser = asyncHandler(async (req, res, next) => {
  const { name, address, email, password } = req.body

  // TODO: refine in order to get personlized msgs for each error
  if (!name || !address || !email || !password) {
    throw new Error('Required fields are missing')
  }

  const emailRegex = /\S+@\S+\.\S+/
  if (!email) {
    throw new Error('Email is required')
  } else if (!emailRegex.test(email)) {
    throw new Error('Email is not valid')
  }

  const existingUserByEmail = await prisma.user.findUnique({
    where: { email: email }
  })

  if (existingUserByEmail) {
    throw new Error('Email already exists.')
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])/
  if (!passwordRegex.test(password)) {
    throw new Error(
      'Password must contain at least one uppercase letter and one special character.'
    )
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = await prisma.user.create({
    data: {
      name,
      address,
      email,
      password: hashedPassword,
      role: req.body.role || 'CLIENT'
    }
  })

  res.status(201).json({ success: true, newUser })
})

// Update User
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update a user's information by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: req.body
  })
  res.status(200).json({ success: true, updatedUser })
})

// Delete User
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  })

  if (!user) throw new Error('User not found')

  await prisma.user.delete({
    where: { id: parseInt(id) }
  })
  res.status(200).send('User deleted successfully')
})

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}
