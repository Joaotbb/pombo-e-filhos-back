const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const auth = require('./authMiddleware')
const prisma = new PrismaClient()

const roleVerification = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).send({ error: 'No token provided' })
    }

    // Divide header in 2 parts
    const parts = authHeader.split(' ')
    const [_, token] = parts

    // Check  token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
    const { id } = decoded

    // Find user on DB
    const user = await prisma.user.findUnique({
      where: { id }
    })
    const isAdmin = user.role === 'ADMINISTRATOR'
    if (!isAdmin) {
      return res.send('You dont permission to execute that operation')
    }
    next()
  } catch (err) {
    console.log(err)
  }
}
module.exports = roleVerification
