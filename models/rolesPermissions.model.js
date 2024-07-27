
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolesPermissions = sequelize.define('Roles_Permissions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    }
}, {
    timestamps: false
});

module.exports = RolesPermissions;
