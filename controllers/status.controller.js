const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const statusService = require('../services/status.service');    

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.patch('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

function getAll(req, res, next) {
    statusService.getAll()
        .then(status => res.json(status))
        .catch(next);
}

function getById(req, res, next) {
    statusService.getById(req.params.id)
        .then(status => res.json(status))
        .catch(next);
}

function create(req, res, next) {
    statusService.create(req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Status registered successfully' 
            }
        ))
        .catch(next);
}

function update(req, res, next) {
    statusService.update(req.params.id, req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Status updated' 
            }
        ))
        .catch(next);
}

function _delete(req, res, next) {
    statusService.delete(req.params.id)
        .then(() => res.json(
            { 
                status: 'success',  
                message: 'Status deleted' 
            }
        ))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        value: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        value: Joi.number().required()
    });
    validateRequest(req, next, schema);
}
