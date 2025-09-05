const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const statusService = require('../services/status.service');

/**
 * Retrieve all statuses.
 *
 * @route GET /status
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object[]>} JSON array of all statuses
 */
exports.getAll = (req, res, next) => {
    statusService.getAll()
        .then(status => res.json(status))
        .catch(next);
};

/**
 * Retrieve a status by its ID.
 *
 * @route GET /status/:id
 * @param {import('express').Request} req - Express request object with `id` parameter.
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object of the requested status
 */
exports.getById = (req, res, next) => {
    statusService.getById(req.params.id)
        .then(status => res.json(status))
        .catch(next);
};

/**
 * Create a new status.
 *
 * @route POST /status
 * @param {import('express').Request} req - Body must include `{ name: string, value: number }`
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON confirmation with success message
 */
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

/**
 * Update an existing status by ID.
 *
 * @route PUT /status/:id
 * @param {import('express').Request} req - Body can include `{ name?: string, value: number }`
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON confirmation with success message
 */
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

/**
 * Delete a status by ID.
 *
 * @route DELETE /status/:id
 * @param {import('express').Request} req - Express request object with `id` parameter.
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON confirmation with success message
 */
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

/**
 * Validation schema for creating a status.
 *
 * Requires both `name` and `value`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        value: Joi.number().required()
    });
    validateRequest(req, next, schema);
};

/**
 * Validation schema for updating a status.
 *
 * Allows updating `name` (optional) and requires `value`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        value: Joi.number().required()
    });
    validateRequest(req, next, schema);
};