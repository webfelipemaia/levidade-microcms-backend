require('dotenv').config();
const { app, appLogger, APP_NAME } = require('./app');

const PORT = process.env.SERVER_PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    appLogger.info(`🚀 ${APP_NAME} running on ${PORT} (${NODE_ENV})`);
  });
}

module.exports = app;