// models/UsersFiles.js (Corrigido)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UsersFiles = sequelize.define('UsersFiles', {    
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },    
    fileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {    
    tableName: 'users_files', 
    timestamps: true,
    freezeTableName: true
});

module.exports = UsersFiles;