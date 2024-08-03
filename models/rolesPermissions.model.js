
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize')

const RolesPermissions = sequelize.define('Roles_Permissions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    timestamps: true
});

module.exports = RolesPermissions;
