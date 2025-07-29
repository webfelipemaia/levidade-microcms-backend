const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const categoryService = require('../services/category.service');

// Controller functions
exports.getAllCategories = (req, res, next) => {
    categoryService.getAll()
        .then(categories => res.json(categories))
        .catch(next);
};

exports.getCategoryById = (req, res, next) => {
    categoryService.getById(req.params.id)
        .then(category => res.json(category))
        .catch(next);
};

exports.createCategory = (req, res, next) => {
    categoryService.create(req.body)
        .then(() => res.json({ message: 'Category created' }))
        .catch(next);
};

exports.createCategoryWithSubcategories = (req, res, next) => {
    categoryService.createWithSubcategories(req.body)
        .then(() => res.json({ message: 'Category with subcategories created' }))
        .catch(next);
};

exports.updateCategory = (req, res, next) => {
    categoryService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Category updated' }))
        .catch(next);
};

exports.deleteCategory = (req, res, next) => {
    categoryService.delete(req.params.id)
        .then(() => res.json({ message: 'Category deleted' }))
        .catch(next);
};

// Schema functions
exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    validateRequest(req, next, schema);
};

exports.createWithSubcategoriesSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        subcategories: Joi.array().items(Joi.object({
            name: Joi.string().required()
        })).required()
    });
    validateRequest(req, next, schema);
};

exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
};