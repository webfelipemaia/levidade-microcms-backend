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
    if (await db.Permission.findOne({ where: { name: params.name } })) {
        throw 'Permission "' + params.name + '" is already registered';
    }

    const permission = new db.Permission(params);
    await permission.save();
}

async function update(id, params) {
    const permission = await getPermission(id);
    const nameChanged = params.name && permission.name !== params.name;
    if (nameChanged && await db.Permission.findOne({ where: { name: params.name } })) {
        throw 'Permission "' + params.name + '" is already registered';
    }

    Object.assign(permission, params);
    await permission.save();
}

async function _delete(id) {
    const permission = await getPermission(id);
    await permission.destroy();
}

async function getPermission(id) {
    const permission = await db.Permission.findByPk(id);
    if (!permission) throw 'Permission not found';
    return permission;
}

async function addPermissionToRole(roleName, permissionName) {
    // Encontra a role
    const role = await db.Role.findOne({ where: { name: roleName } });
    if (!role) {
        throw 'Role not found';
    }

    // Encontra a permissão
    const permission = await db.Permission.findOne({ where: { name: permissionName } });
    if (!permission) {
        throw 'Permission not found';
    }

    // Adiciona a permissão à role
    await role.addPermission(permission);

    return role;
}
