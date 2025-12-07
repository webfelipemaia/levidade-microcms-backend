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
        references: {
            model: 'articles',
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
    tableName: 'articles_files',
    timestamps: true,
})

module.exports = ArticlesFiles;
