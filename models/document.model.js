const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category.model');

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
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Document.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Document;
