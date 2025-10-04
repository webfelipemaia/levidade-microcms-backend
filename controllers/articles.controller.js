const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const articleService = require('../services/article.service');
const fileService = require('../services/file.service ');
const crypto = require("crypto");
const { pagination } = require("../services/setting.service");
const logger = require("../config/logger");

/**
 * Fetches all articles.
 *
 * @route GET /articles
 * @returns {Promise<Object[]>} JSON array of all articles.
 */
exports.getAll = (req, res, next) => {
    articleService.getAll()
        .then(articles => res.json(articles))
        .catch(next);
};

/**
 * Fetches paginated articles with optional search and order parameters.
 *
 * @route GET /articles/paginated
 * @param {number} [req.query.page] - Page number (default 1).
 * @param {number} [req.query.pageSize] - Number of items per page.
 * @param {string} [req.query.search] - Search query string.
 * @param {string} [req.query.order] - JSON string array for sorting order.
 * @returns {Promise<Object>} JSON object containing paginated articles.
 */
exports.getAllPaginated = async (req, res, next) => {
    try {
        const paginationSettings = await pagination();
        const storedPageOrder =  paginationSettings.order;
        const storedPageSize = parseInt(paginationSettings.pageSize);        
        
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || storedPageSize;
        const searchQuery = req.query.search || '';        
        const order = req.query.order ? JSON.parse(req.query.order) : [storedPageOrder];

        const result = await articleService.getPaginatedArticles(page, pageSize, searchQuery, order);

        return res.status(200).json(result);
    } catch (error) {
        logger.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
};

/**
 * Fetches a single article by ID.
 *
 * @route GET /articles/:id
 * @param {string} req.params.id - Article ID
 * @returns {Promise<Object>} JSON object of the requested article.
 */
exports.getById = (req, res, next) => {
    articleService.getById(req.params.id)
        .then(article => res.json(article))
        .catch(next);
};

/**
 * Fetches the last registered article.
 *
 * @route GET /articles/last
 * @returns {Promise<Object>} JSON object of the last created article.
 */
exports.getLastRegister = (req, res, next) => {
    articleService.getLastRegister()
        .then(article => res.json(article))
        .catch(next);
};

/**
 * Creates a new article and updates the associated file if provided.
 *
 * @route POST /articles
 * @param {Object} req.body - Article data including optional fileId.
 * @returns {Promise<Object>} JSON message indicating article creation success.
 */
exports.create = (req, res, next) => {
    let successMessage = null;
    articleService.create(req.body)
        .then(article => {
            if (!article || !article.id) {
                throw new Error('Article creation failed. ID not found.');
            }
            if( req.body.fileId === 0 ) {
                successMessage = 'Article created';
                return Promise.resolve(null);
            } else {
                successMessage = 'Article created with file updated';
                const updatedParams = { ...req.body, articleId: article.id };
                return fileService.renameAndUpdateFile(req.body.fileId, updatedParams);
            }
        })
        .then(() => res.json({ message: successMessage }))
        .catch(next);
};

/**
 * Creates a new article and returns its ID.
 *
 * @route POST /articles/id
 * @param {Object} req.body - Article data.
 * @returns {Promise<Object>} JSON object with status, message, and article ID.
 */
exports.createAndReturnId = (req, res, next) => {
    articleService.create(req.body)
        .then(article => res.json({ status: 'success', message: 'Article created', id: article.id }))
        .catch(next);
};

/**
 * Updates an existing article by ID.
 *
 * @route PUT /articles/:id
 * @param {string} req.params.id - Article ID.
 * @param {Object} req.body - Article data to update.
 * @returns {Promise<Object>} JSON message indicating update success.
 */
exports.update = (req, res, next) => {
    articleService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Article updated' }))
        .catch(next);
};

/**
 * Deletes an article by ID.
 *
 * @route DELETE /articles/:id
 * @param {string} req.params.id - Article ID.
 * @returns {Promise<Object>} JSON message indicating deletion success.
 */
exports._delete = (req, res, next) => {
    articleService.delete(req.params.id)
        .then(() => res.json({ message: 'Article deleted' }))
        .catch(next);
};

/**
 * Validates request body for creating a new article.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').NextFunction} next - Next middleware function.
 */
exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        subtitle: Joi.string().optional(),
        slug: Joi.string().optional(),
        body: Joi.string().optional(),
        status: Joi.number().required(),
        featured: Joi.boolean().required(),
        categoryId: Joi.number().integer().required(),
        fileId: Joi.number().optional(),
    });
    validateRequest(req, next, schema);
};

/**
 * Validates request body for updating an existing article.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').NextFunction} next - Next middleware function.
 */
exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        subtitle: Joi.string().empty(''),
        slug: Joi.string().empty(''),
        body: Joi.string().empty(''),
        status: Joi.number().required(),
        featured: Joi.boolean().empty(''),
        categoryId: Joi.number().integer().empty(''),
        fileId: Joi.number().optional(),
    });
    validateRequest(req, next, schema);
};