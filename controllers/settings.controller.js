const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const settingService = require('../services/setting.service');

exports.getAll = (req, res, next) => {
    settingService.getAll()
        .then(settings => res.json(settings))
        .catch(next);
};

exports.getById = (req, res, next) => {
    settingService.getById(req.params.id)
        .then(setting => res.json(setting))
        .catch(next);
};

exports.update = async (req, res, next) => {
    try {
        let updates = req.body;

        const validUpdates = updates.filter(({ id, value }) => id && value !== undefined);
        if (validUpdates.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Nenhuma configuração válida foi enviada.' });
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
            message: `Configurações processadas: ${successes.length} sucesso(s), ${errors.length} falha(s).`,
            successes: successes.map(s => s.value),
            errors: errors.map(e => e.reason)
        });
    } catch (error) {
        next(error);
    }
};

exports.getPaginationSettings = (req, res, next) => {
    settingService.pagination()
    .then(settings => res.json(settings))
    .catch(next);
};

exports.getUploadpathSettings = (req, res, next) => {
    settingService.uploadPath()
    .then(settings => res.json(settings))
    .catch(next);
};


exports.getFilesizeSettings = (req, res, next) => {
    settingService.fileSize()
    .then(settings => res.json(settings))
    .catch(next);
};


exports.updateSchema = (req, res, next) => {
    const schema = Joi.array().items(
        Joi.object({
            id: Joi.number(),
            value: Joi.string()
        })
    );
    validateRequest(req, next, schema);
};