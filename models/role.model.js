const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
}, {
  tableName: 'roles', 
  timestamps: true,
  freezeTableName: true
});

module.exports = Role;
