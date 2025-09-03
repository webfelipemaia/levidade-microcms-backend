const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const injectLogger = require('../middlewares/logger.middleware');


const appLogger = injectLogger(app);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Levidade API",
      version: "1.0.0",
      description: "Documentação da API com Swagger",
    },
    servers: [
      {
        url: "http://localhost:4000/api/v1",
      },
    ],
  },
  apis: ["./routes/v1/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  appLogger.info(`📄 Swagger disponível em http://localhost:${port}/api-docs`);
}

module.exports = swaggerDocs;
