const config = require('../config/config.json');
const sequelize = require('../config/database.js');
const mysql = require('mysql2/promise');

const User = require('../models/user.model');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const Document = require('../models/document.model');
const Category = require('../models/category.model');
const Section = require('../models/section.model');
const Item = require('../models/item.model');
const RolePermissions = require('../models/rolePermission.model');
const UserRoles = require('../models/userRoles.model');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // Relationships
    User.belongsToMany(Role, { through: UserRoles });
    Role.belongsToMany(User, { through: UserRoles });
    Role.belongsToMany(Permission, { through: RolePermissions });
    Permission.belongsToMany(Role, { through: RolePermissions });
    Document.belongsTo(Category, { foreignKey: 'categoryId' });
    Section.belongsTo(Category, { foreignKey: 'categoryId' });
    Section.hasMany(Item, { foreignKey: 'sectionId' });
    Item.belongsTo(Section, { foreignKey: 'sectionId' });

    // init models and add them to the exported db object
    db.User = User;
    db.Role = Role;
    db.UserRoles = UserRoles;
    db.Permission = Permission;
    db.RolePermissions = RolePermissions;
    db.Document = Document;
    db.Category = Category;
    db.Section = Section;
    db.Item = Item;

    // sync all models with database
    await sequelize.sync({ alter: true });
}
