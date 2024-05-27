const config = require('./config.json');
const { Sequelize } = require('sequelize');


const { host, port, user, password, database } = config.database;
const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: 'mysql'
});

module.exports = sequelize;
