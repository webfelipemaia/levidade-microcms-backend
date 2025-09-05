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

/**
 * Get all articles.
 * @returns {Promise<Array<Object>>} List of all articles.
 */
async function getAll() {
    return await db.Article.findAll();
}

/**
 * Get paginated list of articles with optional search and order.
 * @param {number} page - Current page number.
 * @param {number} pageSize - Number of items per page.
 * @param {string} [searchQuery] - Search term (applies to title and subtitle).
 * @param {Array} [order] - Sequelize order definition (e.g., [['createdAt', 'DESC']]).
 * @returns {Promise<{rows: Array<Object>, count: number}>} Paginated articles.
 */
async function getPaginatedArticles(page, pageSize, searchQuery, order) {
    return await paginate(db.Article, {
        page,
        pageSize,
        searchQuery,
        searchFields: ['title', 'subtitle'],
        order
    });
}

/**
 * Get an article by its ID.
 * @param {number} id - Article ID.
 * @returns {Promise<Object>} The article data.
 * @throws {Error} If the article is not found.
 */
async function getById(id) {
    return await getArticle(id);
}

/**
 * Get the most recently registered article.
 * @returns {Promise<Object>} The last registered article.
 * @throws {Error} If no article is found.
 */
async function getLastRegister() {
    const paginationSettings = await pagination();
    const storedPageOrder = paginationSettings.order;
    const order = req.query.order
        ? JSON.parse(req.query.order)
        : [storedPageOrder];

    const article = await db.Article.findOne({
        order: [order]
    });

    if (!article) throw 'Article not found';
    return article;
}

/**
 * Create a new article.
 * @param {Object} params - Article data.
 * @returns {Promise<Object>} The created article.
 */
async function create(params) {
    const article = new db.Article(params);
    await article.save();
    return article;
}

/**
 * Update an article by its ID.
 * @param {number} id - Article ID.
 * @param {Object} params - Data to update.
 * @returns {Promise<void>}
 * @throws {Error} If the article is not found.
 */
async function update(id, params) {
    const article = await getArticle(id);
    Object.assign(article, params);
    await article.save();
}

/**
 * Delete an article by its ID.
 * @param {number} id - Article ID.
 * @returns {Promise<void>}
 * @throws {Error} If the article is not found.
 */
async function _delete(id) {
    const article = await getArticle(id);
    await article.destroy();
}

/**
 * Helper: Get an article by its ID.
 * Used internally by getById, update, and delete.
 * @private
 * @param {number} id - Article ID.
 * @returns {Promise<Object>} The found article.
 * @throws {Error} If the article is not found.
 */
async function getArticle(id) {
    const article = await db.Article.findByPk(id);
    if (!article) throw 'Article not found';
    return article;
}