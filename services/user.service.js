const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const db = require("../helpers/db.helper");
const logger = require("../config/logger");

module.exports = {
  getAll,
  getUsersRoles,
  getById,
  create,
  update,
  delete: _delete,
  authenticate,
};

/**
 * Recupera todos os usuários, excluindo a senha.
 * @returns {Promise<Array<Object>>} Lista de usuários.
 */
async function getAll() {
  const users = await db.User.findAll({
    attributes: { exclude: ["password"] },
  });
  return users;
}

/**
 * Retrieves all users with their associated roles.
 * @returns {Promise<Array<Object>>} List of users with roles.
 */
async function getUsersRoles() {
  return await db.User.findAll({
    include: db.Role,
    through: {
      attributes: [],
    },
  });
}

/**
 * Retrieves a user by ID.
 * @param {number} id - User ID.
 * @returns {Promise<Object>} User found or error message.
 */
async function getById(id) {
  return await getUser(id);
}

/**
 * Creates a new user.
 * @param {Object} params - User data.
 * @param {string} params.email - User email.
 * @param {string} params.password - User password.
 * @param {string} params.name - User first name.
 * @param {string} params.lastname - User last name.
 * @param {string} [params.role] - User role (optional).
 * @returns {Promise<Object>} Operation status and created user data.
 */
async function create(params) {
  const existingUser = await db.User.findOne({
    where: { email: params.email },
  });
  if (existingUser) {
    throw {
      status: "error",
      message: `Email "${params.email}" is already registered`,
    };
  }
  const hashedPassword = await bcrypt.hash(params.password, 10);

  const user = await db.User.create({
    email: params.email,
    name: params.name,
    lastname: params.lastname,
    role: params.role,
    password: hashedPassword,
  });

  return {
    status: "success",
    message: "User created successfully",
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      role: user.role,
    },
  };
}

/**
 * Adds a role to an existing user.
 * @param {Object} user - User to receive the role.
 * @returns {Promise<Object>} Operation status.
 */
async function addRoleToUser(user) {
  if (await db.User.findOne({ where: { email: user.email } })) {
    throw {
      status: "error",
      message: 'Email "' + user.email + '" is already registered',
    };
  }

  const role = await db.Role.findOne({ where: { name: user.role } });
  if (!role) {
    throw {
      status: "error",
      message: "Role not found",
    };
  }

  await user.addRole(role);

  return { status: "success", message: role };
}

/**
 * Updates a user's information, including roles.
 * @param {number} id - User ID.
 * @param {Object} params - Data to update.
 * @param {string} params.name - User first name.
 * @param {string} params.lastname - User last name.
 * @param {Array<Object>} params.roles - Roles to update.
 * @returns {Promise<Object>} Operation status.
 */
async function update(id, params) {
  try {
    if (!params.name || !params.lastname) {
      return { status: "error", message: "Name and lastname are required." };
    }

    const [rowsUpdated] = await db.User.update(
      {
        name: params.name,
        lastname: params.lastname,
      },
      {
        where: { id: id },
      }
    );

    const user = await db.User.findByPk(id);

    if (!user) {
      return { status: "error", message: "User not found." };
    }

    const rolesByRoleId = await db.UsersRoles.findAll({
      where: {
        userId: user.id,
      },
    });

    params.roles.forEach((role) => {
      if (role.isChecked === "unchecked") {
        user.removeRoles(role.data.id);
      } else {
        user.addRoles(role.data.id);
      }
    });

    return {
      status: "success",
      message: "User and roles updated successfully.",
    };
  } catch (error) {
    logger.error(error);
    return {
      status: "error",
      message: "An error occurred while updating the user.",
    };
  }
}

/**
 * Deletes a user by ID.
 * @param {number} id - User ID.
 * @returns {Promise<Object>} Operation status.
 */
async function _delete(id) {
  try {
    const result = await db.User.destroy({
      where: { id: id },
    });

    if (result > 0) {
      return {
        status: "success",
        message: "User successfully deleted",
      };
    } else {
      return {
        status: "error",
        message: "No user found with the given criteria",
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: `Error deleting user: ${error}`,
    };
  }
}

/**
 * Retrieves a user by ID (internal helper).
 * @param {number} id - User ID.
 * @returns {Promise<Object>} User found or error message.
 */
async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) {
    return {
      status: "error",
      message: "User not found",
    };
  } else {
    return {
      status: "success",
      data: user,
    };
  }
}

/**
 * Authenticates a user using email and password.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<Object>} Authenticated user data.
 * @throws {Object} Error if user is not found or password is incorrect.
 */
async function authenticate(email, password) {
  const user = await db.User.findOne({
    where: { email },
    include: [
      {
        model: db.Role,
        attributes: ['id', 'name']
      },
      {
        model: db.File,
        attributes: ['id', 'name', 'path', 'type'],
        through: { attributes: [] }
      }
    ],
  });

  if (!user) {
    throw { status: "error", message: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: "error", message: "Incorrect password" };
  }

  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    roles: user.Roles?.map((role) => role.name),
    files: user.Files?.map((file) => ({
      id: file.id,
      name: file.name,
      path: file.path,
      type: file.type
    })),
  };
} 
