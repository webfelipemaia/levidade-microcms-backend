const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UsersRoles = sequelize.define('UsersRoles', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "users_roles",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = UsersRoles;
