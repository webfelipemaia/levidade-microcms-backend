const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category.model');
const Sequelize = require('sequelize')

const Article = sequelize.define('Article', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  body: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
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

Article.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Article;
