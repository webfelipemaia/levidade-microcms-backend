const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permission = sequelize.define('Permission', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Permission;