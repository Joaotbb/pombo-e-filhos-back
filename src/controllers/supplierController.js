const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getAllSuppliers = async (req, res) => {
  const allSuppliers = await prisma.supplier.findMany({})
  res.send(allSuppliers)
}



module.exports = {
  getAllSuppliers
}
