const db = require('../helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    return await db.File.findAll();
}

async function getById(id) {
    return await getFile(id);
}

async function create(fileData) {
    return db.File.create(fileData);
}

async function update(id, params) {
    const file = await getFile(id);
    Object.assign(file, params);
    await file.save();
}

async function _delete(id) {
    const file = await getFile(id);
    await file.destroy();
}

async function getFile(id) {
    const file = await db.File.findByPk(id);
    if (!file) throw 'File not found';
    return file;
}
