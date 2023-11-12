const { PrismaClient } = require('@prisma/client')
const { generateToken } = require('../utils/authUtils')
const bcrypt = require('bcrypt')
const asyncHandler = require('../middlewares/asyncHandler')

const prisma = new PrismaClient()

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email for Login
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password for Login
 *     responses:
 *       200:
 *         description: Login Done!!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT Access Token
 *       400:
 *         description: Email &/or password not provided or incorrect
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check if email or password is not provided in the request
  if (!email || !password) {
    return res.status(400).send({ error: 'Email and password are mandatory' })
  }

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email: email }
  })

  // Check if user does not exist
  if (!user) {
    return res.status(404).send({ error: 'User not found' })
  }

  // Compare the provided password with the user's password
  const isMatch = await comparePasswords(password, user.password)

  // Check if password does not match
  if (!isMatch) {
    return res.status(401).send({ error: 'Invalid password' })
  }

  // Send the response with user details and token
  res.send({
    user,
    token: generateToken(user.id)
  })
})

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email para registrar o usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha para o usuário
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token de acesso JWT
 *       400:
 *         description: Email já está em uso
 */
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
