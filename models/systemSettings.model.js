
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize');

// Nota:
// ['settingName', 'value']: especifica as colunas do índice único
// type: "string", "number", "boolean", "json"

const SystemSettings = sequelize.define('System_Settings', {
  settingName: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  value: {
      type: DataTypes.TEXT,
      allowNull: false,
  },
  additionalValue: {
      type: DataTypes.TEXT,
      allowNull: true,
  },
  description: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
  },
  updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
  },
}, {
  sequelize,
  timestamps: true,
  indexes: [
      {
          unique: true,
          fields: ['settingName', 'value'],
          name: 'system_settings_unique_constraint',
      },
  ],
});

module.exports = SystemSettings;
