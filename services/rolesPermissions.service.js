const { Role, Permission, RolesPermissions } = require('../models');
const logger = require("../config/logger");

module.exports = {
    getAll,
    updateRolePermissions,
    getRolePermissions
};

/**
 * Get all permissions with full role details.
 * @returns {Promise<Array<Object>>} List of permissions with full role associations.
 */
async function getAll() {
  try {
    const settings = await RolesPermissions.findAll();
    return { status: "success", data: settings };
  } catch (error) {
    logger.error(`[SettingService] Error in getAll: ${error.message}`);
    throw { status: "error", message: "Failed to retrieve settings." };
  }
}

/**
 * Get permissions for a specific role
 * @param {number} roleId - Role ID
 * @returns {Promise<Array<number>>} Array of permission IDs
 */
async function getRolePermissions(roleId) {
  try {
    const rolePermissions = await RolesPermissions.findAll({
      where: { roleId: roleId },
      include: [
        {
          model: Role,
          as: 'roles',
        },
        {
          model: Permission,
          as: 'permissions',
        }
      ],
      attributes: ['permissionId']
    });
    
    return rolePermissions.map(rp => rp.permissionId);
  } catch (error) {
    logger.error(`[RolesPermissionsService] Error in getRolePermissions: ${error.message}`);
    throw { status: "error", message: "Failed to retrieve role permissions." };
  }
}

/**
 * Update permissions for a specific role
 * @param {number} roleId - Role ID
 * @param {Array<number>} permissionIds - Array of permission IDs to assign to the role
 * @returns {Promise<Object>} Status message
 */
async function updateRolePermissions(roleId, permissionIds) {
  const transaction = await db.sequelize.transaction();
  
  try {
    // Validar se o role existe
    const role = await Role.findByPk(roleId);
    if (!role) {
      await transaction.rollback();
      throw { status: "error", message: "Role not found." };
    }

    // Validar se as permissões existem
    if (permissionIds && permissionIds.length > 0) {
      const permissions = await Permission.findAll({
        where: { id: permissionIds }
      });
      
      if (permissions.length !== permissionIds.length) {
        await transaction.rollback();
        throw { status: "error", message: "One or more permissions not found." };
      }
    }

    // Remover permissões existentes
    await RolesPermissions.destroy({
      where: { roleId: roleId },
      transaction: transaction
    });

    // Adicionar novas permissões
    if (permissionIds && permissionIds.length > 0) {
      const rolePermissionsData = permissionIds.map(permissionId => ({
        roleId: roleId,
        permissionId: permissionId
      }));

      await RolesPermissions.bulkCreate(rolePermissionsData, {
        transaction: transaction
      });
    }

    await transaction.commit();
    
    return { 
      status: "success", 
      message: "Role permissions updated successfully." 
    };
  } catch (error) {
    await transaction.rollback();
    logger.error(`[RolesPermissionsService] Error in updateRolePermissions: ${error.message}`);
    
    // Se já é um erro formatado, repassar
    if (error.status) {
      throw error;
    }
    
    throw { status: "error", message: "Failed to update role permissions." };
  }
}