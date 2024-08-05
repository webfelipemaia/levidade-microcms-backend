const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize')

const Category = sequelize.define('Category', {
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: 'Categories', // Nome da tabela que está sendo referenciada
        key: 'id',
    },
    onDelete: 'CASCADE',
  }, 
  name: {
      type: DataTypes.STRING,
      allowNull: false
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

module.exports = Category;
