const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize')

const Subcategory = sequelize.define('Subcategory', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Category',
            key: 'id'
        },
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

module.exports = Subcategory;
