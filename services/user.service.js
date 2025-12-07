const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const db = require("../helpers/db.helper");
const { paginate } = require('../helpers/pagination.helper');
const logger = require("../config/logger");
const Sequelize = require('sequelize');

module.exports = {
  getAll,
  getPaginatedUsers,
  getUsersRoles,
  getById,
  create,
  update,
  delete: _delete,
  authenticate,
  setUserAvatar,
  getUserWithAvatar,
  removeUserAvatar,
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
 * Get paginated users with search and ordering
 * @param {number} page - Page number
 * @param {number} pageSize - Number of items per page
 * @param {string} searchQuery - Search query for user name or email
 * @param {Array} order - Ordering parameters
 * @returns {Promise<Object>} Paginated users result
 */
async function getPaginatedUsers(page, pageSize, searchQuery, order) {
  
  const searchFields = ['name', 'lastname', 'email'];

  let where = {};

  // Filtros
  if (searchQuery && searchFields.length > 0) {
      where[Sequelize.Op.or] = searchFields.map(field => ({
          [field]: { [Sequelize.Op.like]: `%${searchQuery}%` }
      }));
  }

  return await paginate(db.User, {
      page,
      pageSize,
      searchQuery,
      searchFields,
      order,
      where
  });
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
 * Update user information including avatar
 * @param {number} id - User ID.
 * @param {Object} params - Data to update.
 * @returns {Promise<Object>} Operation status.
 */
async function update(id, params) {
  try {
    if (!params.name || !params.lastname) {
      return { status: "error", message: "Name and lastname are required." };
    }

    const updateData = {
      name: params.name,
      lastname: params.lastname,
    };
    
    // Se um avatarId foi fornecido, atualizar
    if (params.avatarId !== undefined) {
      updateData.avatarId = params.avatarId;
    }

    const [rowsUpdated] = await db.User.update(updateData, {
      where: { id: id },
    });

    const user = await db.User.findByPk(id);

    if (!user) {
      return { status: "error", message: "User not found." };
    }

    // Atualizar roles se fornecidas
    if (params.roles && Array.isArray(params.roles)) {
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
    }

    return {
      status: "success",
      message: "User updated successfully.",
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
        attributes: ['id', 'name'],
        through: { attributes: [] }
      },
      {
        model: db.File,
        as: 'avatar',
        attributes: ['id', 'name', 'path', 'type', 'createdAt', 'updatedAt']
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
    avatar: user.avatar ? {
      id: user.avatar.id,
      name: user.avatar.name,
      path: user.avatar.path,
      type: user.avatar.type,
      fullPath: `${user.avatar.path}${user.avatar.name}`
    } : null,
    roles: user.Roles?.map((role) => role.name),
    files: user.Files?.map((file) => ({
      id: file.id,
      name: file.name,
      path: file.path,
      type: file.type,
      fullPath: `${file.path}${file.name}`
    })),
  };
} 

/**
 * Get user with avatar information
 * @param {number} id - User ID
 * @returns {Promise<Object>} User with avatar
 */
async function getUserWithAvatar(id) {
  const user = await db.User.findByPk(id, {
    include: [
      {
        model: db.Role,
        attributes: ['id', 'name'],
        through: { attributes: [] }
      },
      {
        model: db.File,
        as: 'avatar',
        attributes: ['id', 'name', 'path', 'type', 'createdAt', 'updatedAt']
      }
    ],
    attributes: { exclude: ["password"] }
  });
  
  if (!user) {
    return {
      status: "error",
      message: "User not found"
    };
  }
  
  return {
    status: "success",
    data: user
  };
}

/**
 * Set user avatar
 * @param {number} userId - User ID
 * @param {number} fileId - File ID to set as avatar
 * @returns {Promise<Object>} Operation result
 */
async function setUserAvatar(userId, fileId) {
  try {
    // Verificar se o usuário existe
    const user = await db.User.findByPk(userId);
    if (!user) {
      return {
        status: "error",
        message: "User not found"
      };
    }
    
    // Verificar se o arquivo existe
    const file = await db.File.findByPk(fileId);
    if (!file) {
      return {
        status: "error",
        message: "File not found"
      };
    }
    
    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      return {
        status: "error",
        message: "File is not an image"
      };
    }
    
    // Atualizar o avatar do usuário
    user.avatarId = fileId;
    await user.save();
    
    // Adicionar também à tabela de junção Users_Files (se não existir)
    const existingAssociation = await db.UsersFiles.findOne({
      where: {
        userId: userId,
        fileId: fileId
      }
    });
    
    if (!existingAssociation) {
      await user.addFile(file);
    }
    
    return {
      status: "success",
      message: "Avatar updated successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          lastname: user.lastname
        },
        avatar: file
      }
    };
  } catch (error) {
    logger.error("Error setting user avatar:", error);
    return {
      status: "error",
      message: "Error setting avatar: " + error.message
    };
  }
}

/**
 * Remove user avatar
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Operation result
 */
async function removeUserAvatar(userId) {
  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return {
        status: "error",
        message: "User not found"
      };
    }
    
    user.avatarId = null;
    await user.save();
    
    return {
      status: "success",
      message: "Avatar removed successfully"
    };
  } catch (error) {
    logger.error("Error removing user avatar:", error);
    return {
      status: "error",
      message: "Error removing avatar: " + error.message
    };
  }
}