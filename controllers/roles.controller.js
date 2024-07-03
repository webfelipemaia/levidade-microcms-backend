const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const roleService = require('../services/role.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
router.post('/', createRoleWithPermissions);

module.exports = router;

// route functions

function getAll(req, res, next) {
    roleService.getAll()
        .then(roles => res.json(roles))
        .catch(next);
}

function getById(req, res, next) {
    roleService.getById(req.params.id)
        .then(role => res.json(role))
        .catch(next);
}

function create(req, res, next) {
    roleService.create(req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Role registered successfully' 
            }
        ))
        .catch(next);
}

function update(req, res, next) {
    roleService.update(req.params.id, req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Role updated' 
            }
        ))
        .catch(next);
}

function _delete(req, res, next) {
    roleService.delete(req.params.id)
        .then(() => res.json(
            { 
                status: 'success',  
                message: 'Role deleted' 
            }
        ))
        .catch(next);
}

function createRoleWithPermissions(req, res, next) {
    roleService.createRoleWithPermissions(req.body)
        .then(role => res.json(role))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}
