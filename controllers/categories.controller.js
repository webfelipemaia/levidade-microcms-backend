const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const categoryService = require('../services/category.service');


/**
 * Fetches all categories.
 *
 * @route GET /categories
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<Object[]>} JSON array of all categories.
 */
exports.getAllCategories = (req, res, next) => {
    categoryService.getAll()
        .then(categories => res.json(categories))
        .catch(next);
};

/**
 * Fetches a single category by ID.
 *
 * @route GET /categories/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<Object>} JSON object of the requested category.
 */
exports.getCategoryById = (req, res, next) => {
    categoryService.getById(req.params.id)
        .then(category => res.json(category))
        .catch(next);
};

/**
 * Creates a new category.
 *
 * @route POST /categories
 * @param {import('express').Request} req - Express request object. Expects `name` in `req.body`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<Object>} JSON message indicating creation success.
 */
exports.createCategory = (req, res, next) => {
    categoryService.create(req.body)
        .then(() => res.json({ message: 'Category created' }))
        .catch(next);
};

/**
 * Creates a new category along with subcategories.
 *
 * @route POST /categories/with-subcategories
 * @param {import('express').Request} req - Express request object. Expects `name` and `subcategories` array in `req.body`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<Object>} JSON message indicating creation success.
 */
exports.createCategoryWithSubcategories = (req, res, next) => {
    categoryService.createWithSubcategories(req.body)
        .then(() => res.json({ message: 'Category with subcategories created' }))
        .catch(next);
};

/**
 * Updates an existing category by ID.
 *
 * @route PUT /categories/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<Object>} JSON message indicating update success.
 */
exports.updateCategory = (req, res, next) => {
    categoryService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Category updated' }))
        .catch(next);
};

/**
 * Deletes a category by ID.
 *
 * @route DELETE /categories/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<Object>} JSON message indicating deletion success.
 */
exports.deleteCategory = (req, res, next) => {
    categoryService.delete(req.params.id)
        .then(() => res.json({ message: 'Category deleted' }))
        .catch(next);
};

/**
 * Validates request body for creating a category.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').NextFunction} next - Next middleware function.
 */
exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        parentId: Joi.number().integer().allow(null).optional()
    });
    validateRequest(req, next, schema);
};

/**
 * Validates request body for creating a category with subcategories.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').NextFunction} next - Next middleware function.
 */
exports.createWithSubcategoriesSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        subcategories: Joi.array().items(Joi.object({
            name: Joi.string().required()
        })).required()
    });
    validateRequest(req, next, schema);
};

/**
 * Validates request body for updating a category.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').NextFunction} next - Next middleware function.
 */
exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().empty('').optional(),
        parentId: Joi.number().integer().allow(null).optional()
    });
    validateRequest(req, next, schema);
};