// middleware/morgan.middleware.js
const morgan = require("morgan");
const AppLogger = require("../logger/AppLogger.logger.js"); // se AppLogger for CommonJS

const appLogger = new AppLogger();

// Cria um stream customizado para o Morgan usar o Winston
const stream = {
  write: (message) => {
    appLogger.http(message.trim());
  },
};

// Exporta como função para poder configurar caso queira
module.exports = function () {
  return morgan(
    ":method :url :status :res[content-length] - :response-time ms",
    { stream }
  );
};
