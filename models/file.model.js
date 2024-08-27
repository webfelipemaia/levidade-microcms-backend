const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize');
const Article = require('./article.model');

const File = sequelize.define('File', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
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

File.belongsTo(Article, { foreignKey: 'id'})

module.exports = File;
