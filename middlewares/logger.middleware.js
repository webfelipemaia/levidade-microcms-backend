// middleware/logger.middleware.js
const AppLogger = require("../logger/AppLogger.logger");

/**
 * Initializes and attaches all logging middlewares to an Express application.
 * Returns a logger instance for manual logging (info, warn, error, debug).
 *
 * @function injectLogger
 * @param {import('express').Application} app - The Express application instance to attach logging middlewares to.
 * @returns {Object} Logger instance with the following methods:
 *   - info(message: string): Log informational messages.
 *   - warn(message: string): Log warnings.
 *   - error(message: string | Error): Log errors.
 *   - debug(message: string): Log debug messages.
 *
 * @description
 * - This function sets up structured logging for incoming requests, responses, and errors.
 * - It attaches all necessary middlewares to the provided Express app.
 * - The returned logger instance can be used anywhere in the application for manual logging.
 *
 * @example
 * const express = require('express');
 * const injectLogger = require('./middleware/logger.middleware');
 *
 * const app = express();
 * const appLogger = injectLogger(app); // DO NOT use app.use(injectLogger)
 *
 * appLogger.info('Server is starting...');
 */


module.exports = function injectLogger(app) {
  const appLogger = new AppLogger(app);
  appLogger.setup();
  return appLogger;
};
