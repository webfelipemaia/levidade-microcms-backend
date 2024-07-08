
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserRoles = sequelize.define('UserRoles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'UserRoles',
    timestamps: false
});

module.exports = UserRoles;