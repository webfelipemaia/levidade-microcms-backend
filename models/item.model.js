const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Section = require('./section.model');

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
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Item.belongsTo(Section, { foreignKey: 'sectionId' });

module.exports = Item;
