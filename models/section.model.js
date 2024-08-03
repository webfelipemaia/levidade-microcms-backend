const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category.model');
const Sequelize = require('sequelize')

const Section = sequelize.define('Section', {
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

Section.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Section;
