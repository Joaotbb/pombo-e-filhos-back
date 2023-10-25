const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

const login = async (req, res) => {
  const { email, password } = req.body

  //TODO:create handler for empty POST's (server burning when send empty POST)
  // if (!user || !password) {
  //   return res.status(400).send({ error: 'email and passawrd are mandatory' })
  // }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.status(400).send({ error: 'User not found!' })
  }

  const isMatch = await comparePasswords(password, user.password)
  if (!isMatch) {
    return res.status(400).send({ error: 'Invalid Password' })
  }

  delete user.password

  res.send({
    user,
    token: generateToken(user.id)
  })
}

// TODO:PASS THIS FUNCTION TO AN UTIL
function generateToken(params) {
  return jwt.sign({ id: params }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: '10h'
  })
}

const register = (req, res) => {
  res.send('Register Controller :)')
}

module.exports = {
  login,
  register
}
