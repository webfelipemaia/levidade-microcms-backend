const db = require('../helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Article.findAll();
}

async function getById(id) {
    return await getArticle(id);
}

async function create(params) {
    const document = new db.Article(params);
    await document.save();
}

async function update(id, params) {
    const document = await getArticle(id);
    Object.assign(document, params);
    await document.save();
}

async function _delete(id) {
    const document = await getArticle(id);
    await document.destroy();
}

async function getArticle(id) {
    const document = await db.Article.findByPk(id);
    if (!document) throw 'Article not found';
    return document;
}
