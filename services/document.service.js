const db = require('../helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Document.findAll();
}

async function getById(id) {
    return await getDocument(id);
}

async function create(params) {
    const document = new db.Document(params);
    await document.save();
}

async function update(id, params) {
    const document = await getDocument(id);
    Object.assign(document, params);
    await document.save();
}

async function _delete(id) {
    const document = await getDocument(id);
    await document.destroy();
}

async function getDocument(id) {
    const document = await db.Document.findByPk(id);
    if (!document) throw 'Document not found';
    return document;
}
