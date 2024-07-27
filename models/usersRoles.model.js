
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UsersRoles = sequelize.define('Users_Roles', {
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

module.exports = UsersRoles;