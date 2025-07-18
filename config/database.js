const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config();
}

const config = require('./config.js')[env];
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  config.database,
  config.user,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging || false,
    dialectOptions: {
      charset: 'utf8mb4',
    },
  }
);

module.exports = sequelize;
