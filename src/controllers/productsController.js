const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getAllProducts = async (req, res) => {
  res.send('Get all Products route TESTETETESTE')

}

module.exports = {
  getAllProducts
}
