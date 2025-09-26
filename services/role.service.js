const db = require('../helpers/db.helper');
const logger = require("../config/logger");

module.exports = {
    getAll,
    getRolesPermissions,
    getAllRolesPermissions,
    getById,
    create,
    update,
    delete: _delete,
    createRoleWithPermissions,
    updateRolePermissions,
    getRolePermissions
};

/**
 * Get all roles
 */
async function getAll() {
  try {
    return await db.Role.findAll();
  } catch (error) {
    logger.error(`[RoleService] Error in getAll: ${error.message}`);
    throw { status: "error", message: "Failed to retrieve roles." };
  }
}

/**
 * Get all roles with permissions (id + name only)
 */
async function getRolesPermissions() {
  try {
    return await db.Role.findAll({
      include: [
        {
          model: db.Permission,
          attributes: ["id", "name"],
          through: { attributes: [] }
        },
      ],
    });
  } catch (error) {
    logger.error(`[RoleService] Error in getRolesPermissions: ${error.message}`);
    throw { status: "error", message: "Failed to retrieve roles with permissions." };
  }
}

/**
 * Get all roles with full permissions data
 */
async function getAllRolesPermissions() {
  try {
    return await db.Role.findAll({
      include: [{ model: db.Permission }],
    });
  } catch (error) {
    logger.error(`[RoleService] Error in getAllRolesPermissions: ${error.message}`);
    throw { status: "error", message: "Failed to retrieve roles with full permissions." };
  }
}

/**
 * Get role by ID
 */
async function getById(id) {
  return await getRole(id);
}

/**
 * Create role
 */
async function create(params) {
  try {
    if (await db.Role.findOne({ where: { name: params.name } })) {
      throw { status: "error", message: `"${params.name}" is already registered` };
    }

    const role = new db.Role(params);
    await role.save();

    return { status: "success", message: "Role created successfully.", data: role };
  } catch (error) {
    logger.error(`[RoleService] Error in create: ${error.message}`);
    throw { status: "error", message: "Failed to create role." };
  }
}

/**
 * Update role and permissions
 */
async function update(id, params) {
  try {
    const [rowsUpdated] = await db.Role.update(
      { name: params.name },
      { where: { id } }
    );

    if (rowsUpdated === 0) {
      return { status: "error", message: "Role not found." };
    }

    const role = await db.Role.findByPk(id);
    if (!role) {
      return { status: "error", message: "Role not found." };
    }

    // Update permissions
    for (const permission of params.permissions) {
      if (permission.isChecked === "unchecked") {
        await role.removePermissions(permission.data.id);
      } else {
        await role.addPermissions(permission.data.id);
      }
    }

    return { status: "success", message: "Role and permissions updated successfully." };
  } catch (error) {
    logger.error(`[RoleService] Error in update: ${error.message}`);
    return { status: "error", message: "An error occurred while updating the role." };
  }
}

/**
 * Delete role
 */
async function _delete(id) {
  try {
    const result = await db.Role.destroy({ where: { id } });

    if (result > 0) {
      return { status: "success", message: "Role successfully deleted." };
    } else {
      return { status: "error", message: "No role found with the given criteria." };
    }
  } catch (error) {
    logger.error(`[RoleService] Error in delete: ${error.message}`);
    return { status: "error", message: "Error deleting role." };
  }
}

/**
 * Helper: Get role by ID
 */
async function getRole(id) {
  try {
    const role = await db.Role.findByPk(id);
    if (!role) {
      return { status: "error", message: "Role not found." };
    }
    return { status: "success", data: role };
  } catch (error) {
    logger.error(`[RoleService] Error in getRole: ${error.message}`);
    throw { status: "error", message: "Failed to retrieve role." };
  }
}

/**
 * Create role with permissions
 */
async function createRoleWithPermissions(params) {
  try {
    if (await db.Role.findOne({ where: { name: params.name } })) {
      throw { status: "error", message: `"${params.name}" is already registered` };
    }

    const role = await db.Role.create({ name: params.name });
    const permissions = await db.Permission.findAll({
      where: { name: params.permissions }
    });

    await role.setPermissions(permissions);

    return { status: "success", message: "Role created and permissions added successfully." };
  } catch (error) {
    logger.error(`[RoleService] Error in createRoleWithPermissions: ${error.message}`);
    throw { status: "error", message: "Failed to create role with permissions." };
  }
}

/**
 * Update permissions for a specific role
 * @param {number} roleId - Role ID
 * @param {Array<number>} permissionIds - Array of permission IDs
 * @returns {Promise<Object>} Status message
 */
async function updateRolePermissions(roleId, permissionIds) {
  try {
      // 1. Encontrar o role com suas associações
      const role = await db.Role.findByPk(roleId);
      if (!role) {
          throw { status: "error", message: "Role not found." };
      }

      // 2. Validar permissões (se fornecidas)
      if (permissionIds && permissionIds.length > 0) {
          const permissions = await db.Permission.findAll({
              where: { id: permissionIds }
          });
          
          // Verificar se todas as permissões existem
          if (permissions.length !== permissionIds.length) {
              const foundIds = permissions.map(p => p.id);
              const missingIds = permissionIds.filter(id => !foundIds.includes(id));
              throw { 
                  status: "error", 
                  message: `Permissions not found: ${missingIds.join(', ')}` 
              };
          }
          
          // 3. Usar setPermissions para atualizar as associações
          await role.setPermissions(permissions);
      } else {
          // 4. Se array vazio, remover todas as permissões
          await role.setPermissions([]);
      }

      return { 
          status: "success", 
          message: "Role permissions updated successfully." 
      };
      
  } catch (error) {
      logger.error(`[RoleService] Error in updateRolePermissions: ${error.message}`);
      
      // Se já é um erro formatado, repassar
      if (error.status) {
          throw error;
      }
      
      throw { status: "error", message: "Failed to update role permissions." };
  }
}

/**
* Get permissions for a specific role
* @param {number} roleId - Role ID
* @returns {Promise<Array<number>>} Array of permission IDs
*/
async function getRolePermissions(roleId) {
  try {
      const role = await db.Role.findByPk(roleId, {
          include: [{
              model: db.Permission,
              through: { attributes: [] } // Não incluir dados da tabela de junção
          }]
      });

      if (!role) {
          throw { status: "error", message: "Role not found." };
      }

      // Extrair apenas os IDs das permissões
      return role.Permissions ? role.Permissions.map(p => p.id) : [];
      
  } catch (error) {
      logger.error(`[RoleService] Error in getRolePermissions: ${error.message}`);
      throw { status: "error", message: "Failed to retrieve role permissions." };
  }
}
