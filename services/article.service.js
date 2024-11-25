const db = require('../helpers/db');
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

// Sem o helper
/* async function getPaginatedArticles(page, pageSize, searchQuery, order) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    let where = {};
    if (searchQuery) {
        where = {
            [Sequelize.Op.or]: [
                { title: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                { subtitle: { [Sequelize.Op.like]: `%${searchQuery}%` } }
            ]
        };
    }

    const articles =  await db.Article.findAndCountAll({
        where: where,
        limit: limit,
        offset: offset,
        order: order
    });
    console.log('articles: ', articles)
    return {
        total: articles.count,
        totalPages: Math.ceil(articles.count / pageSize),
        currentPage: page,
        articles: articles.rows
    };
} */

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
