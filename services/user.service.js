const bcrypt = require('bcryptjs');
const db = require('../helpers/db.helper');

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
    include: db.Role,
    through: {
      attributes: [], 
    }
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
    
    const user = new db.User(params);    
    user.passwordHash = await bcrypt.hash(params.password, 10);
    await user.save();
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

  try {

    if (!params.name || !params.lastname) {
      return { status: "error", message: "Name and lastname are required." };
    }

    // Updating user data
    const [rowsUpdated] = await db.User.update(
      { 
        name: params.name,
        lastname: params.lastname
      },
      {
        where: { id: id }
      }
    );

    // Finding the updated user
    const user = await db.User.findByPk(id)

    if(!user) {
      return { status: "error", message: "User not found." };
    }

    // retrieve rolels from user.id
    const rolesByRoleId = await db.UsersRoles.findAll({
      where: {
        userId: user.id
      }
    })

    // delete or add a role to user
    params.roles.forEach((role) => {

      if(role.isChecked === 'unchecked') {
        user.removeRoles(role.data.id)
      } else {
        user.addRoles(role.data.id)
      }
    })

    return { 
      status: "success", 
      message: "User and roles updated successfully." 
    };
    
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