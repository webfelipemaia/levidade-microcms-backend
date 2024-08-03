const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Section = require('./section.model');
const Sequelize = require('sequelize')

const Item = sequelize.define('Item', {
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

Item.belongsTo(Section, { foreignKey: 'sectionId' });

module.exports = Item;
