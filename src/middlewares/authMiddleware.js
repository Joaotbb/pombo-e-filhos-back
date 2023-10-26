const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({ error: 'No token provided' });
    }

    // Dividir o header em suas partes
    const parts = authHeader.split(' ');
    const [_, token] = parts;

    // Verificar o token e extrair o ID do usuário
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    const { id } = decoded;

    // Encontrar o usuário no banco de dados
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