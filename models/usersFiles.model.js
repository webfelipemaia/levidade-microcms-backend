// models/UsersFiles.js (Corrigido)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UsersFiles = sequelize.define('UsersFiles', {
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },    
    fileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'files',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
}, {
    id: false,
    tableName: 'users_files', 
    timestamps: true,
});

module.exports = UsersFiles;