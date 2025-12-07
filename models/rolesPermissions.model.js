// models/RolesPermissions.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolesPermissions = sequelize.define(
  'RolesPermissions',
  {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'permissions',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'roles_permissions',
    timestamps: true,
  }
);

module.exports = RolesPermissions;
