const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const categoryService = require('../services/category.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.post('/with-subcategories', createWithSubcategoriesSchema, createWithSubcategories);
router.patch    ('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    categoryService.getAll()
        .then(categories => res.json(categories))
        .catch(next);
}

function getById(req, res, next) {
    categoryService.getById(req.params.id)
        .then(category => res.json(category))
        .catch(next);
}

function create(req, res, next) {
    categoryService.create(req.body)
        .then(() => res.json({ message: 'Category created' }))
        .catch(next);
}

function createWithSubcategories(req, res, next) {
    categoryService.createWithSubcategories(req.body)
        .then(() => res.json({ message: 'Category with subcategories created' }))
        .catch(next);
}

function update(req, res, next) {
    categoryService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Category updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    categoryService.delete(req.params.id)
        .then(() => res.json({ message: 'Category deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function createWithSubcategoriesSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        subcategories: Joi.array().items(Joi.object({
            name: Joi.string().required()
        })).required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}
