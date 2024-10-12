
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize');
const Article = require('./article.model');
const File = require('./file.model');

const ArticlesFiles = sequelize.define('Articles_Files', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Article,
          key: 'id'
        }
    },
    fileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: File, 
          key: 'id'
        }
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

module.exports = ArticlesFiles;