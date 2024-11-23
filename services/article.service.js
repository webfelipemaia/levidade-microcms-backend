const db = require('../helpers/db');

module.exports = {
    getAll,
    getById,
    getLastRegister,
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

async function getLastRegister() {
    const article = await db.Article.findOne({
        order: [['createdAt', 'DESC']]     
    });
    if (!article) throw 'Article not found';
    return article;
}

async function create(params) {
    const article = new db.Article(params);
    await article.save();
    return article;
}

async function update(id, params) {
    const article = await getArticle(id);
    Object.assign(article, params);
    await article.save();
}

async function _delete(id) {
    const article = await getArticle(id);
    await article.destroy();
}

async function getArticle(id) {
    const article = await db.Article.findByPk(id);
    if (!article) throw 'Article not found';
    return article;
}
