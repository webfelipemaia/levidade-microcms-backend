const config = require('../config/config.json');
const sequelize = require('../config/database.js');
const mysql = require('mysql2/promise');

const User = require('../models/user.model');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const Category = require('../models/category.model');
const Article = require('../models/article.model');
const RolesPermissions = require('../models/rolesPermissions.model');
const UsersRoles = require('../models/usersRoles.model');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
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
    
    // init models and add them to the exported db object
    db.User = User;
    db.Role = Role;
    db.UsersRoles = UsersRoles;
    db.Permission = Permission;
    db.RolesPermissions = RolesPermissions;
    db.Article = Article;
    db.Category = Category;
    
    // sync all models with database
    await sequelize.sync({ alter: false });
}
