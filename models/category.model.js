const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize')

const Category = sequelize.define('Category', {
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

Category.associate = (models) => {
  Category.hasMany(models.Subcategory, { foreignKey: 'categoryId' });
};

module.exports = Category;
