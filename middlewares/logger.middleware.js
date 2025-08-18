// middleware/logger.middleware.js
const AppLogger = require("../logger/AppLogger.logger");

/**
 * Inicializa e anexa todos os middlewares de logging ao Express.
 * Retorna a instância para você usar logs manuais (info/warn/error/debug).
 *
 * Uso no server.js:
 *   const injectLogger = require('./middleware/logger.middleware');
 *   const appLogger = injectLogger(app); // NÃO usar app.use(injectLogger)
 *   appLogger.info('Servidor subindo...');
 */
module.exports = function injectLogger(app) {
  const appLogger = new AppLogger(app);
  appLogger.setup();
  return appLogger;
};
