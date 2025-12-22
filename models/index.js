const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const sequelize = require('../config/database');

const db = {};

// 1. Carregar modelos
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    // Importa o modelo já definido
    const model = require(path.join(__dirname, file));
    
    // Adiciona ao objeto db (ex: db.Article, db.User)
    if (model.name) {
      db[model.name] = model;
    }
  });

// 2. Compatibilidade para o Helper de Settings
// Se o model no arquivo systemSettings.model.js foi definido como 'Settings'
if (db.Settings && !db.SystemSettings) db.SystemSettings = db.Settings;

// 3. Definição manual das Associações (Baseado no seu db.helper antigo)

// USER <-> ROLE
if (db.User && db.Role && db.UsersRoles) {
  db.User.belongsToMany(db.Role, { through: db.UsersRoles, foreignKey: 'userId', otherKey: 'roleId', as: 'roles' });
  db.Role.belongsToMany(db.User, { through: db.UsersRoles, foreignKey: 'roleId', otherKey: 'userId', as: 'users' });
}

// ROLE <-> PERMISSION
if (db.Role && db.Permission && db.RolesPermissions) {
  db.Role.belongsToMany(db.Permission, { through: db.RolesPermissions, foreignKey: 'roleId', otherKey: 'permissionId', as: 'permissions' });
  db.Permission.belongsToMany(db.Role, { through: db.RolesPermissions, foreignKey: 'permissionId', otherKey: 'roleId', as: 'roles' });
}

// CATEGORY (Auto-relacionamento)
if (db.Category) {
  db.Category.belongsTo(db.Category, { as: 'parent', foreignKey: 'parentId' });
  db.Category.hasMany(db.Category, { as: 'children', foreignKey: 'parentId' });
}

// ARTICLE -> CATEGORY
if (db.Article && db.Category) {
  db.Article.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });
}

// USER -> FILE (Avatar)
if (db.User && db.File) {
  db.User.belongsTo(db.File, { as: 'avatar', foreignKey: 'avatarId' });
}

// TABELAS PIVOT DE ARQUIVOS (Muitos para Muitos)
if (db.Article && db.File && db.ArticlesFiles) {
  db.Article.belongsToMany(db.File, { through: db.ArticlesFiles, foreignKey: 'articleId', otherKey: 'fileId', as: 'files' });
}
if (db.User && db.File && db.UsersFiles) {
  db.User.belongsToMany(db.File, { through: db.UsersFiles, foreignKey: 'userId', otherKey: 'fileId', as: 'userFiles' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;