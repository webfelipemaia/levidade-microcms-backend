const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize')

const Permission = sequelize.define('Permission', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
  }
}, {
  sequelize, timestamps: true,
});

module.exports = Permission;