const db = require('../helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    createRoleWithPermissions
};

async function getAll() {
    //return await db.Role.findAll();
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
    const role = await getRole(id);

    // validate
    const nameChanged = params.name && role.name !== params.name;
    if (nameChanged && await db.Role.findOne({ 
        where: { 
            name: params.name 
        } 
    })) {
        throw {
            status: 'error',
            message: params.name + ' is already registered'
        };
    }

    try {
        const [rowsUpdated] = await db.Role.update(
          { 
            name: params.name
          },
          {
            where: {
              id: id,
            },
          }
        );
    
        if (rowsUpdated > 0) {
          return { status: "success", message: "Role updated successfully." };
        } else {
          return { status: "error", message: "Role not found or no changes made." };
        }
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