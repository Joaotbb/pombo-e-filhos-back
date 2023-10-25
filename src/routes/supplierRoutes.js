const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireRole } = require('../middlewares/auth.middleware');
const prisma = new PrismaClient();

// Create:
router.post('/', requireRole('ADMIN'), async (req, res) => {
    const supplier = await prisma.supplier.create({ data: req.body });
    res.json(supplier);
});

// Read:
router.get('/', async (req, res) => {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
});


module.exports = router;