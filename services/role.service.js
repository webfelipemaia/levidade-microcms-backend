const db = require('../helpers/db.helper');

module.exports = {
    getAll,
    getRolesPermissions,
    getAllRolesPermissions,
    getById,
    create,
    update,
    delete: _delete,
    createRoleWithPermissions
};

async function getAll() {
    return await db.Role.findAll();
}

async function getRolesPermissions() {
  return await db.Role.findAll({
      include: [
        {
          model: db.Permission,
          attributes: ["id", "name"],
          through: {
            attributes: [],
          }
        },
      ],
    })
}

async function getAllRolesPermissions() {
  return await db.Role.findAll({
      include: [
        {
          model: db.Permission,
        },
      ],
    })
}

async function getById(id) {
    return await getRole(id);
}

async function create(params) {
    
    if (await db.Role.findOne({ where: { name: params.name } })) {
        throw { 
            status: 'error', 
            message: params.name + '" is already registered'
        };
    }

    const role = new db.Role(params);
    await role.save();
}

async function update(id, params) {
  try {
      // Updating the role name
      const rowsUpdated = await db.Role.update(
        { name: params.name },
        {
          where: {
            id: id,
          },
        }
      );
  
      // Finding the updated role
      const role = await db.Role.findByPk(id);
  
      if (!role) {
        return { status: "error", message: "Role not found." };
      }  

      // retrieve permissions from role.id
      const permissionsByRoleId = await db.RolesPermissions.findAll({
        where: {
          roleId: role.id,
        },
      });
      
      // delete or add a permission to the role
      params.permissions.forEach((permission) => {
          
        if(permission.isChecked === 'unchecked') {
          role.removePermissions(permission.data.id);
        } else {
          role.addPermissions(permission.data.id);
        }

      })
  
      return {
        status: "success",
        message: "Role and permissions updated successfully."
      };
      
    } catch (error) {
      console.error(error);
      return { status: "error", message: "An error occurred while updating the role." };
    }
  }
    
async function _delete(id) {
    try {
        const result = await db.Role.destroy({
          where: {
            id: id,
          },
        });
      
        if (result > 0) {
            return { 
                status: "success", 
                message: "Role successfully deleted" 
            }
        } else {
            return {
                status: "error",
                message: "No role found with the given criteria"
            }
        }
      } catch (error) {
        return { status: "error", message: `Error deleting role: ${error}` };
      }
}

// helper functions

async function getRole(id) {
    const role = await db.Role.findByPk(id);
    if (!role) {
        return { 
            status: "error", 
            message: "Role not found" 
        }
    } else {
        return { 
            status: "success", 
            data: role 
        }
    }
}

async function createRoleWithPermissions(params) {
    
    if (await db.Role.findOne({ where: { name: params.name } })) {
        throw { 
            status: 'error', 
            message: params.name + '" is already registered'
        };
    }

    // Create role
    const role = await db.Role.create(
        { 
            name: params.name
         }
    );

    // Add permissions to role
    const permissions = await db.Permission.findAll({
        where: {
            name: params.permissions
        }
    });

    await role.setPermissions(permissions);
    
    return { 
        status: "success", 
        message: "Role created and permissions added successfully                        " 
    }
}