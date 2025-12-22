const { Permission, Role } = require('../models');
const logger = require("../config/logger");
const Sequelize = require('sequelize');
const { paginate } = require('../helpers/pagination.helper');

module.exports = {
    getAll,
    getPaginatedPermissions,
    getPermissionsRoles,
    getAllPermissionsRoles,
    getById,
    create,
    update,
    delete: _delete,
    addPermissionToRole
};


/**
 * Get all permissions.
 * @returns {Promise<Array<Object>>} List of all permissions.
 */
async function getAll() {
  return await Permission.findAll();
}

/**
 * Get paginated permissions with search and ordering
 * @param {number} page - Page number
 * @param {number} pageSize - Number of items per page
 * @param {string} searchQuery - Search query for permission name
 * @param {Array} order - Ordering parameters
 * @returns {Promise<Object>} Paginated permissions result
 */
async function getPaginatedPermissions(page, pageSize, searchQuery, order) {
  // Campos pesquisáveis - apenas name para permissions
  const searchFields = ['name'];

  let where = {};

  // Filtros
  if (searchQuery && searchFields.length > 0) {
      where[Sequelize.Op.or] = searchFields.map(field => ({
          [field]: { [Sequelize.Op.like]: `%${searchQuery}%` }
      }));
  }

  return await paginate(Permission, {
      page,
      pageSize,
      searchQuery,
      searchFields,
      order,
      where
  });
}

/**
 * Get all permissions with their associated roles (id and name only).
 * @returns {Promise<Array<Object>>} List of permissions with role associations.
 */
async function getPermissionsRoles() {
  return await Permission.findAll({
    include: [
      {
        model: Role,
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
    ],
  });
}

/**
 * Get all permissions with full role details.
 * @returns {Promise<Array<Object>>} List of permissions with full role associations.
 */
async function getAllPermissionsRoles() {
  return await Permission.findAll({
    include: [
      {
        model: Role,
      },
    ],
  });
}

/**
 * Get a permission by ID.
 * @param {number} id - Permission ID.
 * @returns {Promise<Object>} The permission object.
 * @throws {Object} If no permission is found.
 */
async function getById(id) {
  return await getPermission(id);
}

/**
 * Create a new permission.
 * @param {Object} params - Permission data.
 * @param {string} params.name - Permission name.
 * @returns {Promise<void>}
 * @throws {Object} If the permission name is already registered.
 */
async function create(params) {
  if (await Permission.findOne({ where: { name: params.name } })) {
    throw {
      status: 'error',
      message: params.name + ' is already registered',
    };
  }

  const permission = new Permission(params);
  await permission.save();
}

/**
 * Update an existing permission.
 * @param {number} id - Permission ID.
 * @param {Object} params - Fields to update.
 * @param {string} params.name - New permission name.
 * @returns {Promise<Object>} Result with status and message.
 */
async function update(id, params) {
  const permission = await getPermission(id);
  const nameChanged = params.name && permission.name !== params.name;

  if (nameChanged && await Permission.findOne({ where: { name: params.name } })) {
    throw {
      status: 'error',
      message: 'Permission "' + params.name + '" is already registered',
    };
  }

  try {
    const [rowsUpdated] = await Permission.update(
      { name: params.name },
      { where: { id: id } }
    );

    if (rowsUpdated > 0) {
      return { status: "success", message: "Permission updated successfully." };
    } else {
      return { status: "error", message: "Permission not found or no changes made." };
    }
  } catch (error) {
    logger.error(error);
    return { status: "error", message: "An error occurred while updating the permission." };
  }
}

/**
 * Delete a permission by ID.
 * @param {number} id - Permission ID.
 * @returns {Promise<Object>} Result with status and message.
 */
async function _delete(id) {
  try {
    const result = await Permission.destroy({ where: { id: id } });

    if (result > 0) {
      return { status: "success", message: "Permission successfully deleted" };
    } else {
      return { status: "error", message: "No permission found with the given criteria" };
    }
  } catch (error) {
    return { status: "error", message: `Error deleting permission: ${error}` };
  }
}

/**
 * Internal helper: Find a permission by ID.
 * @private
 * @param {number} id - Permission ID.
 * @returns {Promise<Object>} The found permission.
 * @throws {Object} If no permission is found.
 */
async function getPermission(id) {
  const permission = await Permission.findByPk(id);
  if (!permission) throw {
    status: "error",
    message: "No permission found with the given criteria",
  };
  return permission;
}

/**
 * Associate a permission with a role.
 * @param {string} roleName - Role name.
 * @param {string} permissionName - Permission name.
 * @returns {Promise<Object>} Result with status and role data.
 * @throws {Object} If role or permission is not found.
 */
async function addPermissionToRole(roleName, permissionName) {
  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) {
    throw { status: 'error', message: 'Role not found' };
  }

  const permission = await Permission.findOne({ where: { name: permissionName } });
  if (!permission) {
    throw { status: 'error', message: 'Permission not found' };
  }

  await role.addPermission(permission);

  return { status: 'success', message: role };
}