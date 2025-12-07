// models/user.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatarId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'files',
      key: 'id'
    }
  },
}, {
  tableName: 'users', 
  timestamps: true,
});

// 1. Relacionamento 1:1 para o Avatar
const File = require('./file.model'); 
User.belongsTo(File, {
    foreignKey: 'avatarId',
    as: 'avatar'
});

// 2. Relacionamento N:M para arquivos adicionais
const UsersFiles = require('./UsersFiles');
User.belongsToMany(File, {
    through: UsersFiles,
    foreignKey: 'userId',
    otherKey: 'fileId',
    as: 'additionalFiles' // Um nome distinto para o alias
});

module.exports = User;