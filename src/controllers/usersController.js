const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const asyncHandler = require('../middlewares/asyncHandler')

const prisma = new PrismaClient()

// Get all Users
const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await prisma.user.findMany({})
  res.send(allUsers)
})

// Get a single User by ID
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
