const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const roleService = require('../services/role.service');    

exports.getAll = (req, res, next) => {
    roleService.getAll()
        .then(roles => res.json(roles))
        .catch(next);
};

exports.getRolesPermissions = (req, res, next) => {
    roleService.getRolesPermissions()
        .then(roles => res.json(roles))
        .catch(next);
};


exports.getAllRolesPermissions = (req, res, next) => {
    roleService.getAllRolesPermissions()
        .then(roles => res.json(roles))
        .catch(next);
};

exports.getById = (req, res, next) => {
    roleService.getById(req.params.id)
        .then(role => res.json(role))
        .catch(next);
};

exports.create = (req, res, next) => {
    roleService.create(req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Role registered successfully' 
            }
        ))
        .catch(next);
};

exports.update = (req, res, next) => {
    roleService.update(req.params.id, req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Role updated' 
            }
        ))
        .catch(next);
};

exports._delete = (req, res, next) => {
    roleService.delete(req.params.id)
        .then(() => res.json(
            { 
                status: 'success',  
                message: 'Role deleted' 
            }
        ))
        .catch(next);
};

exports.createRoleWithPermissions = (req, res, next) => {
    roleService.createRoleWithPermissions(req.body)
        .then(role => res.json(role))
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
        name: Joi.string().empty(''),
        permissions: Joi.array().empty('')
    });
    validateRequest(req, next, schema);
};
