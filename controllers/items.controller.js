const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const itemService = require('../services/item.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    itemService.getAll()
        .then(items => res.json(items))
        .catch(next);
}

function getById(req, res, next) {
    itemService.getById(req.params.id)
        .then(item => res.json(item))
        .catch(next);
}

function create(req, res, next) {
    itemService.create(req.body)
        .then(() => res.json({ message: 'Item created' }))
        .catch(next);
}

function update(req, res, next) {
    itemService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Item updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    itemService.delete(req.params.id)
        .then(() => res.json({ message: 'Item deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        subtitle: Joi.string().optional(),
        description: Joi.string().optional(),
        sectionId: Joi.number().integer().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        subtitle: Joi.string().empty(''),
        description: Joi.string().empty(''),
        sectionId: Joi.number().integer().empty('')
    });
    validateRequest(req, next, schema);
}
