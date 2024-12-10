const db = require('../helpers/db.helper');
const Sequelize = require('sequelize');
module.exports = {
    getAll,
    getById,
    getLastRegister,
    create,
    update,
    delete: _delete,
    getPaginatedArticles,
};

const { paginate } = require('../helpers/pagination.helper');

async function getAll() {
    return await db.Article.findAll();
}

// Usando helper
async function getPaginatedArticles(page, pageSize, searchQuery, order) {
    return await paginate(db.Article, {
        page,
        pageSize,
        searchQuery,
        searchFields: ['title', 'subtitle'],
        order
    });
}

async function getById(id) {
    return await getArticle(id);
}

async function getLastRegister() {

    const paginationSettings = await pagination();
    const storedPageOrder =  paginationSettings.order
    const order = req.query.order
            ? JSON.parse(req.query.order)
            : [storedPageOrder];
    const article = await db.Article.findOne({
        order: [order]     
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
