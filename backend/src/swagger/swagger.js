const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KIOT API',
      version: '1.0.0',
      description: 'CRUD API with JWT Auth for KIOT project',
    },
    // servers: [
    //   { url: 'http://localhost:3000/api' }
    // ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ProductVariant: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            product_id: {
              type: 'integer',
            },
            sku: {
              type: 'string',
            },
            price: {
              type: 'integer',
            },
            quantity: {
              type: 'integer',
            },
            color_id: {
              type: 'integer',
            },
            size_id: {
              type: 'integer',
            },
            color: {
              type: 'object',
              nullable: true,
              properties: {
                id: {
                  type: 'integer',
                },
                name: {
                  type: 'string',
                },
              },
            },
            size: {
              type: 'object',
              nullable: true,
              properties: {
                id: {
                  type: 'integer',
                },
                name: {
                  type: 'string',
                },
              },
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    security: [
      { bearerAuth: [] } // Áp dụng cho tất cả endpoint nếu muốn
    ],
  },
  apis: ['./src/routes/*.js'], // quét tất cả route
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
