const bcrypt = require('bcryptjs');
const db = require('../helpers/db');

module.exports = {
    getAll,
    getUsersRoles,
    getById,
    create,
    update,
    delete: _delete,
    authenticate,
};

async function getAll() {    
    const users = await db.User.findAll({ attributes: {exclude:['password']} });
    return users;
}

async function getUsersRoles() {

return await db.User.findAll({
  include: [
    {
      model: db.Role,
      attributes: ["id", "name"],
      through: {
        attributes: [],
      }
    },
  ],
})
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw { 
          status: 'error', 
          message: 'Email "' + params.email + '" is already registered' 
        };
    }

    const role = await db.Role.findOne({ where: { name: params.role } });
    if (!role) {
        throw { 
            status: 'error', 
            message: 'Role not found' 
        };
    }

    const user = new db.User(params);    
    user.passwordHash = await bcrypt.hash(params.password, 10);
    await user.save();
    await user.addRole(role);
}

async function addRoleToUser(user) {
    
  if (await db.User.findOne({ where: { email: user.email } })) {
      throw { 
        status: 'error', 
        message: 'Email "' + user.email + '" is already registered' 
      };
  }

  const role = await db.Role.findOne({ where: { name: user.role } });
  if (!role) {
      throw { 
          status: 'error', 
          message: 'Role not found' 
      };
  }

  // Adiciona role to user
  await user.addRole(role);

  return { status: 'success', message: role };
}

async function update(id, params) {
    
  if (!params.name || !params.lastname) {
    return { status: "error", message: "Name and lastname are required." };
  }

  try {
    const [rowsUpdated] = await db.User.update(
      { 
        name: params.name,
        lastname: params.lastname
      },
      {
        where: { id: id }
      }
    );

    if (rowsUpdated > 0) {
      return { 
        status: "success", 
        message: "User updated successfully." 
      };
    } else {
      return { 
        status: "error", 
        message: "User not found or no changes made." 
      };
    }
  } catch (error) {
    console.error(error);
    return { 
      status: "error", 
      message: "An error occurred while updating the user." 
    };
  }
}

async function _delete(id) {

      try {
        const result = await db.User.destroy({
          where: { id: id },
        });
      
        if (result > 0) {
            return { 
                status: "success", 
                message: "User successfully deleted" 
            }
        } else {
            return {
                status: "error",
                message: "No user found with the given criteria"
            }
        }
      } catch (error) {
        return { 
          status: "error", 
          message: `Error deleting user: ${error}` 
        };
      }
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) {
        return { 
            status: "error", 
            message: "User not found" 
        }
    } else {
        return { 
            status: "success", 
            data: user 
        }
    }
}

async function authenticate(email, password){
    
    const user = await db.User.findOne({ where: {email: `${email}`} });
    var isRegistered = false;
    
    if (!user) {
        return { 
            status: "error", 
            message: "User not found" 
        }
    }
      
    if (user.password === password) isRegistered = true
    
    if (isRegistered) {
        const user = await db.User.findAll(
             { attributes: {exclude:['password']} },
             { where: {email: `${email}`} },
             { limit: 1 }
        );
        return { 
            status: "success", 
            data: user[0]
        }
    } else {
        return { 
            status: "error", 
            message: "Password incorrect" 
        }
    }
  };