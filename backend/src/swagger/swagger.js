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
