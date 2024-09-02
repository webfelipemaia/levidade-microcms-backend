const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize');
const User = require('./user.model');

const Image = sequelize.define('Image', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.NOW
  },

}, {
  sequelize, timestamps: true,
});

Image.belongsTo(User, { foreignKey: 'userId' });

module.exports = Image;
