
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize');
const User = require('./user.model');
const File = require('./file.model');

const UsersFiles = sequelize.define('Users_Files', {
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

module.exports = UsersFiles;