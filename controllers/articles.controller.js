const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const articleService = require('../services/article.service');
const fileService = require('../services/file.service ');

// routes

router.get('/', getAll);
router.get('/last', getLastRegister);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.post('/create-with-return',createSchema, createAndReturnId);
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

function getLastRegister(req, res, next) {
    articleService.getLastRegister()
        .then(article => res.json(article))
        .catch(next);
}


function create(req, res, next) {
    articleService.create(req.body)
        .then(article => {
            if (!article || !article.id) {
                throw new Error('Article creation failed. ID not found.');
            }
            // Adiciona o ID do artigo criado aos parâmetros para o fileService.update
            const updatedParams = { ...req.body, articleId: article.id };
            return fileService.renameAndUpdateFile(req.body.fileId, updatedParams);
        })
        .then(() => res.json({ message: 'Article created with file updated' }))
        .catch(next);
}

function createAndReturnId(req, res, next) {
    articleService.create(req.body)
        .then(article => res.json({ status: 'success', message: 'Article created', id: article.id }))
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
        slug: Joi.string().optional(),
        body: Joi.string().optional(),
        status: Joi.number().required(),
        featured: Joi.boolean().required(),
        categoryId: Joi.number().integer().required(),
        fileId: Joi.number().optional(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
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
}