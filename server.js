require('dotenv').config();
const { app, appLogger, APP_NAME } = require('./app');
const db = require('./models');

const PORT = process.env.SERVER_PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  try {

    await db.sequelize.authenticate();
    appLogger.info('✅ Database connection established.');

    if (NODE_ENV === 'development') {      
      await db.sequelize.sync({ alter: false });
      appLogger.info('DB synced with { alter: false }');
    }

    app.listen(PORT, () => {
      appLogger.info(`🚀 ${APP_NAME} running on ${PORT} (${NODE_ENV})`);
    });

  } catch (error) {
    appLogger.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;