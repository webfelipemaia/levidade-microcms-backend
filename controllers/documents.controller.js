const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const documentService = require('../services/document.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    documentService.getAll()
        .then(documents => res.json(documents))
        .catch(next);
}

function getById(req, res, next) {
    documentService.getById(req.params.id)
        .then(document => res.json(document))
        .catch(next);
}

function create(req, res, next) {
    documentService.create(req.body)
        .then(() => res.json({ message: 'Document created' }))
        .catch(next);
}

function update(req, res, next) {
    documentService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Document updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    documentService.delete(req.params.id)
        .then(() => res.json({ message: 'Document deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        subtitle: Joi.string().optional(),
        description: Joi.string().optional(),
        categoryId: Joi.number().integer().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        subtitle: Joi.string().empty(''),
        description: Joi.string().empty(''),
        categoryId: Joi.number().integer().empty('')
    });
    validateRequest(req, next, schema);
}
