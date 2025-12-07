// models/user.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const File = require('./file.model');
const UsersFiles = require('./usersFiles.model');

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

// Associações

User.belongsTo(File, {
    foreignKey: 'avatarId',
    as: 'avatar'
});

User.belongsToMany(File, {
    through: UsersFiles,
    foreignKey: 'userId',
    otherKey: 'fileId',
    as: 'additionalFiles'
});

module.exports = User;