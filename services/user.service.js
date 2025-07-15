const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const db = require("../helpers/db.helper");

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
  const users = await db.User.findAll({
    attributes: { exclude: ["password"] },
  });
  return users;
}

async function getUsersRoles() {
  return await db.User.findAll({
    include: db.Role,
    through: {
      attributes: [],
    },
  });
}

async function getById(id) {
  return await getUser(id);
}

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
    console.error(error);
    return {
      status: "error",
      message: "An error occurred while updating the user.",
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

/* async function authenticate(email, password) {
  const user = await db.User.findOne({
    where: { email },
    include: db.Role,
  });

  if (!user) {
    throw { status: "error", message: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw { status: "error", message: "Incorrect password" };
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.Roles?.map((r) => r.name),
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || "1h" }
  );

  return {
    status: "success",
    message: "Authentication successful",
    data: {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      roles: user.Roles?.map((r) => r.name),
      token,
    },
  };
} */

  async function authenticate(email, password) {
    const user = await db.User.findOne({
      where: { email },
      include: db.Role,
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
      roles: user.Roles?.map((r) => r.name),
    };
  }
  
