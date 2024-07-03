const db = require('../helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    addPermissionToRole
};

async function getAll() {
    return await db.Permission.findAll();
}

async function getById(id) {
    return await getPermission(id);
}

async function create(params) {
    if (await db.Permission.findOne(
        { 
            where: { 
                name: params.name 
            } 
        })) {
        throw {
            statys: 'error',
            message: params.name + ' is already registered'
        };
    }

    const permission = new db.Permission(params);
    await permission.save();
}

async function update(id, params) {
    
    const permission = await getPermission(id);
    const nameChanged = params.name && permission.name !== params.name;
    if (nameChanged && await db.Permission.findOne({ where: { name: params.name } })) {
        throw {
            status: 'error',
            message: 'Permission "' + params.name + '" is already registered'
        };
    }

    try {
        const [rowsUpdated] = await db.Permission.update(
            { name: params.name },
            { where: { id: id } }
        );
    
        if (rowsUpdated > 0) {
            return { 
                status: "success", 
                message: "Permission updated successfully." 
            };
        } else {
            return { 
                status: "error", 
                message: "Permission not found or no changes made." 
            };
        }
    } catch (error) {
        console.error(error);
        return { 
            status: "error", 
            message: "An error occurred while updating the permission." 
        };
    }
}

async function _delete(id) {
    try {
        const result = await db.Permission.destroy({
          where: { id: id },
        });
      
        if (result > 0) {
            return { 
                status: "success", 
                message: "Permission successfully deleted" 
            }
        } else {
            return {
                status: "error",
                message: "No permission found with the given criteria"
            }
        }
      } catch (error) {
        return { 
          status: "error", 
          message: `Error deleting permission: ${error}` 
        };
    }
}

async function getPermission(id) {
    const permission = await db.Permission.findByPk(id);
    if (!permission) throw  {
        status: "error",
        message: "No permission found with the given criteria"
    };
    return permission;
}

async function addPermissionToRole(roleName, permissionName) {
    // Encontra a role
    const role = await db.Role.findOne({ where: { name: roleName } });
    if (!role) {
        throw { 
            status: 'error', 
            message: 'Role not found' 
        };
    }

    // Encontra a permissão
    const permission = await db.Permission.findOne({ where: { name: permissionName } });
    if (!permission) {
        throw { 
            status: 'error', 
            message: 'Permission not found' 
        };
    }

    // Adiciona a permissão à role
    await role.addPermission(permission);

    return { status: 'success', message: role };
}
