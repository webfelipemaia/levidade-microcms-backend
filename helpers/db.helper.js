// helpers/db.helper.js
const config = require('../config/config.js');
const sequelize = require('../config/database.js');
const mysql = require('mysql2/promise');
const logger = require("../config/logger");

// Import Models
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

// Exported object
module.exports = db = {};

initialize();

async function initialize() {

    // Create DB if not exists (development-friendly)
    const { host, port, user, password, database } = config.development;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // ---------------------------------------------------------------------
    // ASSOCIAÇÕES
    // ---------------------------------------------------------------------


    // USER <-> ROLE (Many-to-Many)

    User.belongsToMany(Role, { 
        through: UsersRoles,
        foreignKey: 'userId',
        otherKey: 'roleId',
    });

    Role.belongsToMany(User, { 
        through: UsersRoles,
        foreignKey: 'roleId',
        otherKey: 'userId',
    });



    // ROLE <-> PERMISSION (Many-to-Many)

    Role.belongsToMany(Permission, { 
        through: RolesPermissions,
        foreignKey: 'roleId',
        otherKey: 'permissionId',
    });

    Permission.belongsToMany(Role, { 
        through: RolesPermissions,
        foreignKey: 'permissionId',
        otherKey: 'roleId',
    });



    // CATEGORY (Hierarquia: parent <-> children)

    Category.belongsTo(Category, { 
        as: 'parent', 
        foreignKey: 'parentId' 
    });

    Category.hasMany(Category, { 
        as: 'children', 
        foreignKey: 'parentId' 
    });



    // ARTICLE -> CATEGORY (One-to-Many)

    Article.belongsTo(Category, { foreignKey: 'categoryId' });



    // ARTICLE <-> FILE (Many-to-Many)

    Article.belongsToMany(File, { 
        through: ArticlesFiles,
        foreignKey: 'articleId',
        otherKey: 'fileId',
    });

    File.belongsToMany(Article, { 
        through: ArticlesFiles,
        foreignKey: 'fileId',
        otherKey: 'articleId',
    });



    // USER <-> FILE (Many-to-Many)

    User.belongsToMany(File, { 
        through: UsersFiles,
        foreignKey: 'userId',
        otherKey: 'fileId',
    });

    File.belongsToMany(User, { 
        through: UsersFiles,
        foreignKey: 'fileId',
        otherKey: 'userId',
    });



    // USER -> FILE (One-to-One Avatar)

    User.belongsTo(File, { 
        as: 'avatar', 
        foreignKey: 'avatarId' 
    });

    File.hasOne(User, { 
        as: 'userAvatar', 
        foreignKey: 'avatarId' 
    });


    // ---------------------------------------------------------------------
    // Adiciona os models ao objeto db
    // ---------------------------------------------------------------------
    db.User = User;
    db.Role = Role;
    db.UsersRoles = UsersRoles;
    db.Permission = Permission;
    db.RolesPermissions = RolesPermissions;
    db.Article = Article;
    db.Category = Category;
    db.Status = Status;
    db.File = File;
    db.UsersFiles = UsersFiles;
    db.ArticlesFiles = ArticlesFiles;
    db.SystemSettings = SystemSettings;


    // ---------------------------------------------------------------------
    // Synchronize Database
    // ---------------------------------------------------------------------
    await syncDatabase();
}


async function syncDatabase() {
    try {

        if (process.env.NODE_ENV === 'production') {
            // Nunca alter em produção
            await sequelize.sync();
            logger.info('Database synchronized (production mode).');
        } else {
            // Pode usar alter em modo Dev/test
            await sequelize.sync({ alter: true });
            logger.info('Database synchronized with `alter: true` (dev/test mode).');
        }

    } catch (error) {
        logger.error('Erro ao sincronizar o banco:', error);
    }
}

module.exports = db;
