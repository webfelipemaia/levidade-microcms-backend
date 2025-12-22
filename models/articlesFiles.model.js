const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArticlesFiles = sequelize.define('ArticlesFiles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'articles_files',
    timestamps: true,
    freezeTableName: true 
})

module.exports = ArticlesFiles;
