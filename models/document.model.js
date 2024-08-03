const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category.model');
const Sequelize = require('sequelize')

const Document = sequelize.define('Document', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
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

Document.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Document;
