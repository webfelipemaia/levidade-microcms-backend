const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UsersRoles = sequelize.define('UsersRoles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { 
        model:  'users', 
        key: 'id' 
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { 
        model: 'roles', 
        key: 'id' 
      },
    },
  },
  {
    tableName: "users_roles",
    timestamps: true,
  }
);

module.exports = UsersRoles;
