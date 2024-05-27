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
    return await db.Role.findAll();
}

async function getById(id) {
    return await getRole(id);
}

async function create(params) {
    // validate
    if (await db.Role.findOne({ where: { name: params.name } })) {
        throw 'Role "' + params.name + '" is already registered';
    }

    const role = new db.Role(params);

    // save role
    await role.save();
}

async function update(id, params) {
    const role = await getRole(id);

    // validate
    const nameChanged = params.name && role.name !== params.name;
    if (nameChanged && await db.Role.findOne({ where: { name: params.name } })) {
        throw 'Role "' + params.name + '" is already registered';
    }

    // copy params to role and save
    Object.assign(role, params);
    await role.save();
}

async function _delete(id) {
    const role = await getRole(id);
    await role.destroy();
}

// helper functions

async function getRole(id) {
    const role = await db.Role.findByPk(id);
    if (!role) throw 'Role not found';
    return role;
}

async function createRoleWithPermissions(params) {
    
    const role = await db.Role.create({ name: params.name });

    // Add permissions to role
    const permissions = await db.Permission.findAll({
        where: {
            name: params.permissions
        }
    });

    await role.setPermissions(permissions);

    return role;
}