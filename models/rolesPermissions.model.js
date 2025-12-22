// models/RolesPermissions.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolesPermissions = sequelize.define(
  'RolesPermissions',
  {
    roleId: {
      type: DataTypes.INTEGER,
      references: { model: 'roles', key: 'id' }
    },
    permissionId: {
      type: DataTypes.INTEGER,
      references: { model: 'permissions', key: 'id' }
    }
  },
  {
    tableName: 'roles_permissions',
    timestamps: true,
    freezeTableName: true 
  }
);

module.exports = RolesPermissions;
