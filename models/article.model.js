const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category.model');

const Article = sequelize.define(
  'Article',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    body: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  },
  {
    tableName: 'articles',
    timestamps: true
  }
);

// Associação
Article.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

// Adicionar em article.model.js
const File = require('./file.model'); // Importar File
const ArticlesFiles = require('./ArticlesFiles'); // Importar a tabela intermediária

Article.belongsToMany(File, {
    through: ArticlesFiles, // A model de junção
    foreignKey: 'articleId', // A chave de Article na tabela de junção
    otherKey: 'fileId', // A chave do outro lado (File)
    as: 'files'
});

module.exports = Article;
