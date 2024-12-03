const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const settingService = require('../services/setting.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

function getAll(req, res, next) {
    settingService.getAll()
        .then(settings => res.json(settings))
        .catch(next);
}

function getById(req, res, next) {
    settingService.getById(req.params.id)
        .then(setting => res.json(setting))
        .catch(next);
}

function create(req, res, next) {
    settingService.create(req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Setting registered successfully' 
            }
        ))
        .catch(next);
}

function update(req, res, next) {
    settingService.update(req.body.id, req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Setting updated' 
            }
        ))
        .catch(next);
}

function _delete(req, res, next) {
    settingService.delete(req.params.id)
        .then(() => res.json(
            { 
                status: 'success',  
                message: 'Setting deleted' 
            }
        ))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        settingName: Joi.string().required(),
        value: Joi.string().required(),
        additionalValue: Joi.string().empty(''),
        description: Joi.string().empty(''),
        type: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        settingName: Joi.string().required(),
        value: Joi.string().required(),
        additionalValue: Joi.string().empty(''),
        description: Joi.string().empty(''),
        type: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}
