const products = [
  {
    name: 'PHILIPS light bulb',
    description: 'Product description 1',
    serialNumber: 'ODS241',
    price: 10.99,
    stock: 100,
    suppliers: {
      connect: [{ id: 1 }, { id: 2 }]
    }
  },
  {
    name: ' Home automation controler ',
    description: 'Product description 2',
    serialNumber: 'KLSD4',
    price: 15.5,
    stock: 80,
    suppliers: {
      connect: [{ id: 3 }]
    }
  },
  {
    name: 'Solar Inverter',
    description: 'Product description 3',
    serialNumber: 'KAS26',
    price: 10.99,
    stock: 100,
    suppliers: {
      connect: [{ id: 3 }, { id: 2 }, { id: 1 }]
    }
  },
  {
    name: 'Smart Thermostat',
    description: 'Product description 4',
    serialNumber: 'THRM282',
    price: 120.99,
    stock: 50,
    suppliers: {
      connect: [{ id: 2 }, { id: 4 }]
    }
  },
  {
    name: 'LED Panel 60W',
    description: 'Product description 5',
    serialNumber: 'LED60W35',
    price: 30.75,
    stock: 150,
    suppliers: {
      connect: [{ id: 1 }]
    }
  },
  {
    name: 'Security Camera Wi-Fi',
    description: 'Product description 6',
    serialNumber: 'SCWX992',
    price: 89.99,
    stock: 40,
    suppliers: {
      connect: [{ id: 3 }, { id: 4 }]
    }
  },
  {
    name: 'Wireless Bluetooth Speaker',
    description: 'Product description 7',
    serialNumber: 'BTS9000',
    price: 45.99,
    stock: 200,
    suppliers: {
      connect: [{ id: 5 }]
    }
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Product description 8',
    serialNumber: 'EOC561',
    price: 149.99,
    stock: 75,
    suppliers: {
      connect: [{ id: 2 }, { id: 6 }]
    }
  },
  {
    name: 'Portable Air Conditioner',
    description: 'Product description 9',
    serialNumber: 'PAC6791',
    price: 299.99,
    stock: 30,
    suppliers: {
      connect: [{ id: 1 }, { id: 3 }]
    }
  }
]

module.exports = products
