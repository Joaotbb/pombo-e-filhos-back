const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({ error: 'No token provided' });
    }

    // Divide header into 2 parts
    const parts = authHeader.split(' ');
    const [_, token] = parts;

    // Check token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    const { id } = decoded;

    // Find ID on DB
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(401).send({ error: 'Token invalid' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ error: 'Token invalid or expired' });
  }
};

module.exports = auth;