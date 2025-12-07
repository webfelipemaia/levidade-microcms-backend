const env = process.env.NODE_ENV || 'development';
require('dotenv').config({
    path: env === 'test' ? '.env.test' : '.env'
});

const config = require('./config.js')[env];
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  config.database,
  config.username,
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
