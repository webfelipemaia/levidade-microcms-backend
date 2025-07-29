const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const permissionService = require('../services/permission.service');


exports.getAll = (req, res, next) => {
    permissionService.getAll()
        .then(permissions => res.json(permissions))
        .catch(next);
};

exports.getPermissionsRoles = (req, res, next) => {
    permissionService.getPermissionsRoles()
        .then(permissions => res.json(permissions))
        .catch(next);
};

exports.getAllPermissionsRoles = (req, res, next) => {
    permissionService.getAllPermissionsRoles()
        .then(permissions => res.json(permissions))
        .catch(next);
};

exports.getById = (req, res, next) => {
    permissionService.getById(req.params.id)
        .then(permission => res.json(permission))
        .catch(next);
};

exports.create = (req, res, next) => {
    permissionService.create(req.body)
        .then(() => res.json({ status: 'success', message: 'Permission created' }))
        .catch(next);
};

exports.update = (req, res, next) => {
    permissionService.update(req.params.id, req.body)
        .then(() => res.json({ status: 'success', message: 'Permission updated' }))
        .catch(next);
};

exports._delete = (req, res, next) => {
    permissionService.delete(req.params.id)
        .then(() => res.json({ status: 'success', message: 'Permission deleted' }))
        .catch(next);
};

exports.addPermissionsToRole = (req, res, next) => {
    const { roleName, permissionName } = req.body;
    permissionService.addPermissionToRole(roleName, permissionName)
        .then(role => res.json({status: 'success', message: 'Permission added successfully', role }))
        .catch(next);
};

// schema functions

exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    validateRequest(req, next, schema);
};

exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
};
