
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolePermissions = sequelize.define('RolePermissions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    created_at: {
        type: DataTypes.DATE,
        //allowNull: false,
        //defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        //allowNull: false,
        //defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'RolePermissions',
    timestamps: false
});

module.exports = RolePermissions;
