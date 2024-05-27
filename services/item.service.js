const db = require('../helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Item.findAll();
}

async function getById(id) {
    return await getItem(id);
}

async function create(params) {
    const item = new db.Item(params);
    await item.save();
}

async function update(id, params) {
    const item = await getItem(id);
    Object.assign(item, params);
    await item.save();
}

async function _delete(id) {
    const item = await getItem(id);
    await item.destroy();
}

async function getItem(id) {
    const item = await db.Item.findByPk(id);
    if (!item) throw 'Item not found';
    return item;
}
