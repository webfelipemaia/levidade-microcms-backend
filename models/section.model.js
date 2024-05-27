const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category.model');

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
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Section.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Section;
