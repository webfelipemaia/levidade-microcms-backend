// middleware/morgan.middleware.js
const morgan = require("morgan");
const AppLogger = require("../logger/AppLogger.logger.js");

const appLogger = new AppLogger();

// Create a custom stream for Morgan to use Winston
const stream = {
  write: (message) => {
    appLogger.http(message.trim());
  },
};

module.exports = function () {
  return morgan(
    ":method :url :status :res[content-length] - :response-time ms",
    { stream }
  );
};
