const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Article = require('./article.model');

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'categories',
    timestamps: true,
  }
);

Category.hasMany(Article, {
  foreignKey: 'categoryId',
  as: 'articles'
});

module.exports = Category;
