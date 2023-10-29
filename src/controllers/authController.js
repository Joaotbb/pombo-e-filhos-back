const { PrismaClient } = require('@prisma/client')
const { generateToken } = require('../utils/authUtils')
const bcrypt = require('bcrypt')
const asyncHandler = require('../middlewares/asyncHandler')

const prisma = new PrismaClient()

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  //TODO:create handler for empty POST's (server burning when send empty POST)
  // if (!user || !password) {
  //   return res.status(400).send({ error: 'email and passawrd are mandatory' })
  // }

  const user = await prisma.user.findUnique({
    where: { email: email }
  })

  if (!user) {
    throw new Error('User not Found')
  }

  const isMatch = await comparePasswords(password, user.password)
  if (!isMatch) {
    throw new Error('Password ')
  }

  res.send({
    user,
    token: generateToken(user.id)
  })
})

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check if the mail is already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error('Email already exist')
  }

  // Hash pw before save on DB
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  })

  // Generates a token for a new user
  const token = generateToken(newUser.id)

  res.status(201).send({
    user: newUser,
    token
  })
})

module.exports = {
  login,
  register
}
