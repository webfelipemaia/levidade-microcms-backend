const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const permissionService = require('../services/permission.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
router.post('/add', addPermissionsToRole);

module.exports = router;

// route functions

function getAll(req, res, next) {
    permissionService.getAll()
        .then(permissions => res.json(permissions))
        .catch(next);
}

function getById(req, res, next) {
    permissionService.getById(req.params.id)
        .then(permission => res.json(permission))
        .catch(next);
}

function create(req, res, next) {
    permissionService.create(req.body)
        .then(() => res.json({ message: 'Permission created' }))
        .catch(next);
}

function update(req, res, next) {
    permissionService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Permission updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    permissionService.delete(req.params.id)
        .then(() => res.json({ message: 'Permission deleted' }))
        .catch(next);
}

function addPermissionsToRole(req, res, next) {
    const { roleName, permissionName } = req.body;
    permissionService.addPermissionToRole(roleName, permissionName)
        .then(role => res.json({ message: 'Permission added successfully', role }))
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
