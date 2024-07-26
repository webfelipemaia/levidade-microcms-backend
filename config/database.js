// standard connection
//const config = require('./config.json');

// migration connection
const config = require('./config.js');
const { Sequelize } = require('sequelize');

// Setting for standard connection
/* const { host, port, user, password, database } = config.database;
const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: 'mysql'
}); */


// Configuration using migrations
const { host, port, username, password, database } = config.development;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'mysql'
});

module.exports = sequelize;
