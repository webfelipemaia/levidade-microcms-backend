
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