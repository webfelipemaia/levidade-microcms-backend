const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const settingService = require('../services/setting.service');

/**
 * Fetch all system settings.
 *
 * @route GET /settings
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object[]>} JSON array of all settings
 */
exports.getAll = (req, res, next) => {
    settingService.getAll()
        .then(settings => res.json(settings))
        .catch(next);
};

/**
 * Fetch a single setting by ID.
 *
 * @route GET /settings/:id
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object of the requested setting
 */
exports.getById = (req, res, next) => {
    settingService.getById(req.params.id)
        .then(setting => res.json(setting))
        .catch(next);
};

/**
 * Update multiple settings.
 *
 * Expects an array of objects with `id` and `value` in the request body.
 * Returns the count of successful and failed updates.
 *
 * @route PUT /settings
 * @param {import('express').Request} req - Array of settings to update: [{ id: number, value: string }]
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object containing successes and errors
 */
exports.update = async (req, res, next) => {
    try {
        let updates = req.body;

        const validUpdates = updates.filter(({ id, value }) => id && value !== undefined);
        if (validUpdates.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No valid configuration was sent.' });
        }

        const results = await Promise.allSettled(
            validUpdates.map(({ id, value }) =>
                settingService.update(id, { value })
            )
        );

        const successes = results.filter(result => result.status === 'fulfilled');
        const errors = results.filter(result => result.status === 'rejected');

        res.json({
            status: 'partial',
            message: `Processed settings: ${successes.length} success(es), ${errors.length} fault(s).`,
            successes: successes.map(s => s.value),
            errors: errors.map(e => e.reason)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Fetch pagination-related settings.
 *
 * @route GET /settings/pagination
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object of pagination settings
 */
exports.getPaginationSettings = (req, res, next) => {
    settingService.pagination()
    .then(settings => res.json(settings))
    .catch(next);
};

/**
 * Fetch upload path settings.
 *
 * @route GET /settings/upload-path
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object of upload path settings
 */
exports.getUploadpathSettings = (req, res, next) => {
    settingService.uploadPath()
    .then(settings => res.json(settings))
    .catch(next);
};

/**
 * Fetch file size settings.
 *
 * @route GET /settings/filesize
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object of file size settings
 */
exports.getFilesizeSettings = (req, res, next) => {
    settingService.fileSize()
    .then(settings => res.json(settings))
    .catch(next);
};

/**
 * Validation schema for updating settings.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.updateSchema = (req, res, next) => {
    const schema = Joi.array().items(
        Joi.object({
            id: Joi.number(),
            value: Joi.string()
        })
    );
    validateRequest(req, next, schema);
};