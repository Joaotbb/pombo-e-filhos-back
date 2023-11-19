const swaggerJsDoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Pombo e Filhos',
      version: '1.0.0',
      description: 'API documentation for requests of Pombo e Filhos'
    },
    servers: [
      {
        url: 'http://localhost:8080/api/v1',
        description: 'Local Server of Development'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64'
            },
            name: {
              type: 'string',
              nullable: true
            },
            address: {
              type: 'string',
              nullable: true
            },
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string'
            },
            role: {
              type: 'string'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true
            }
            // Assuming orders are not returned with the User object by default
          }
        },
        Supplier: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64'
            },
            name: {
              type: 'string'
            },
            address: {
              type: 'string'
            },
            company: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            phone: {
              type: 'string'
            }
            // products and orders not included by default
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64'
            },
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            serialNumber: {
              type: 'string',
              nullable: true
            },
            price: {
              type: 'number',
              format: 'float'
            },
            stock: {
              type: 'integer'
            }
            // suppliers and orderItems not included by default
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64'
            },
            date: {
              type: 'string',
              format: 'date-time'
            },
            shipDate: {
              type: 'string',
              format: 'date-time',
              nullable: true
            },
            status: {
              type: 'string',
              nullable: true
            },
            orderType: {
              type: 'string',
              nullable: true
            },
            userId: {
              type: 'integer',
              format: 'int64',
              nullable: true
            },
            supplierId: {
              type: 'integer',
              format: 'int64',
              nullable: true
            }
            // Assuming orderItems are not returned with the Order object by default
          }
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64'
            },
            orderId: {
              type: 'integer',
              format: 'int64'
            },
            productId: {
              type: 'integer',
              format: 'int64'
            },
            quantity: {
              type: 'integer'
            },
            unitPrice: {
              type: 'number',
              format: 'float'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['src/routes/**.js', 'src/controllers/**.js'] // Paths to the route and model definitions
}

const swaggerSpec = swaggerJsDoc(options)

module.exports = swaggerSpec
