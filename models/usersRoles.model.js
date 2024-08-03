
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize')

const UsersRoles = sequelize.define('Users_Roles', {
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
    sequelize, timestamps: true,
});

module.exports = UsersRoles;