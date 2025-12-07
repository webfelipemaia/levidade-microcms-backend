const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define(
  'File',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'files',
    timestamps: true
  }
);

// Adicionar em file.model.js
const Article = require('./article.model'); // Importar Article
const ArticlesFiles = require('../models/ArticlesFiles'); // Importar a tabela intermediária

File.belongsToMany(Article, {
    through: ArticlesFiles,
    foreignKey: 'fileId',
    otherKey: 'articleId',
    as: 'articles'
});

// 1. Relacionamento 1:1 para o Avatar
const User = require('./user.model');
File.hasMany(User, {
    foreignKey: 'avatarId',
    as: 'avatarUsers'
});

// 2. Relacionamento N:M para arquivos adicionais
const UsersFiles = require('./UsersFiles');
File.belongsToMany(User, {
    through: UsersFiles,
    foreignKey: 'fileId',
    otherKey: 'userId',
    as: 'usersWithFile'
});

module.exports = File;
