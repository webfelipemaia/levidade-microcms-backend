const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const articleService = require('../services/article.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    articleService.getAll()
        .then(articles => res.json(articles))
        .catch(next);
}

function getById(req, res, next) {
    articleService.getById(req.params.id)
        .then(article => res.json(article))
        .catch(next);
}

function create(req, res, next) {
    articleService.create(req.body)
        .then(() => res.json({ message: 'Article created' }))
        .catch(next);
}

function update(req, res, next) {
    articleService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Article updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    articleService.delete(req.params.id)
        .then(() => res.json({ message: 'Article deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        subtitle: Joi.string().optional(),
        body: Joi.string().optional(),
        state: Joi.bool().required(),
        categoryId: Joi.number().integer().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        subtitle: Joi.string().empty(''),
        body: Joi.string().empty(''),
        body: Joi.bool().required(),
        categoryId: Joi.number().integer().empty('')
    });
    validateRequest(req, next, schema);
}
