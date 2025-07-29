const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const statusService = require('../services/status.service');

exports.getAll = (req, res, next) => {
    statusService.getAll()
        .then(status => res.json(status))
        .catch(next);
};

exports.getById = (req, res, next) => {
    statusService.getById(req.params.id)
        .then(status => res.json(status))
        .catch(next);
};

exports.create = (req, res, next) => {
    statusService.create(req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Status registered successfully' 
            }
        ))
        .catch(next);
};

exports.update = (req, res, next) => {
    statusService.update(req.params.id, req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Status updated' 
            }
        ))
        .catch(next);
};

exports._delete = (req, res, next) => {
    statusService.delete(req.params.id)
        .then(() => res.json(
            { 
                status: 'success',  
                message: 'Status deleted' 
            }
        ))
        .catch(next);
};

exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        value: Joi.number().required()
    });
    validateRequest(req, next, schema);
};

exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        value: Joi.number().required()
    });
    validateRequest(req, next, schema);
};