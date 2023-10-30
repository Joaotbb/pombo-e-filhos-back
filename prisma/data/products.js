const products = [
  {
    name: 'Lampada PHILIPS',
    description: 'Descrição do Produto 1',
    serialNumber: 'ODS241',
    price: 10.99,
    stock: 100,
    suppliers: {
      connect: [{ id: 7 }, { id: 9 }]
    }
  },
  {
    name: 'Comando domótica',
    description: 'Descrição do Produto 2',
    serialNumber: 'KLSD4',
    price: 15.5,
    stock: 80,
    suppliers: {
      connect: [{ id: 9 }]
    }
  },
  {
    name: 'Produto 3',
    description: 'Descrição do Produto 3',
    serialNumber: 'KAS26',
    price: 10.99,
    stock: 100,
    suppliers: {
      connect: [{ id: 9 }, { id: 10 }, { id: 12 }]
    }
  }
]

module.exports = products
