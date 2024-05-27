const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
  },
  updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
  }
});

Category.associate = (models) => {
  Category.hasMany(models.Subcategory, { foreignKey: 'categoryId' });
};

module.exports = Category;
