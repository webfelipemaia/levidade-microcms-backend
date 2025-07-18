const config = require('../config/config.js');
const sequelize = require('../config/database.js');
const mysql = require('mysql2/promise');

const User = require('../models/user.model');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const Category = require('../models/category.model');
const Article = require('../models/article.model');
const RolesPermissions = require('../models/rolesPermissions.model');
const UsersRoles = require('../models/usersRoles.model');
const Status = require('../models/status.model.js');
const File = require('../models/file.model');
const UsersFiles = require('../models/usersFiles.model.js');
const ArticlesFiles = require('../models/articlesFiles.model.js');
const SystemSettings = require('../models/systemSettings.model.js');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.development;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // Relationships
    User.belongsToMany(Role, { through: 'Users_Roles', foreignKey: 'userId', otherKey: 'roleId', });
    Role.belongsToMany(User, { through: 'Users_Roles', foreignKey: 'roleId', otherKey: 'userId', });
    Role.belongsToMany(Permission, { through: 'Roles_Permissions', foreignKey: 'roleId', otherKey: 'permissionId', });
    Permission.belongsToMany(Role, { through: 'Roles_Permissions', foreignKey: 'permissionId', otherKey: 'roleId', });
    Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });
    Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });
    Article.belongsTo(Category, { foreignKey: 'categoryId' });
    Article.belongsToMany(File, { through: 'Articles_Files', foreignKey: 'articleId', otherKey: 'fileId', });
    File.belongsToMany(Article, { through: 'Articles_Files',  foreignKey: 'fileId', otherKey: 'articleId', });
    User.belongsToMany(File, {  through: 'Users_Files', foreignKey: 'userId', otherKey: 'fileId', });
    File.belongsToMany(User, { through: 'Users_Files', foreignKey: 'fileId', otherKey: 'userId', });

    
    // init models and add them to the exported db object
    db.User = User;
    db.Role = Role;
    db.UsersRoles = UsersRoles;
    db.Permission = Permission;
    db.RolesPermissions = RolesPermissions;
    db.Article = Article;
    db.Category = Category;
    db.Status = Status;
    db.File = File;
    db.ArticlesFiles = ArticlesFiles;
    db.UsersFiles = UsersFiles;
    db.SystemSettings = SystemSettings;
    
  // Sincroniza os modelos com o banco
  await syncDatabase();
}

// Função para sincronizar o banco com base no ambiente
async function syncDatabase() {
  try {
    if (process.env.NODE_ENV === 'test') {
      await sequelize.sync({ alter: false });
      console.log('Banco sincronizado com `force: true` para testes.');
    } else {
      await sequelize.sync({ alter: false });
      console.log('Banco sincronizado com `alter: false` para produção/dev.');
    }
  } catch (error) {
    console.error('Erro ao sincronizar o banco:', error);
  }
}

module.exports = db;
