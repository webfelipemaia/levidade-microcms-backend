const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const settingService = require('../services/setting.service');

// routes

router.get('/', getAll);
router.get('/pagination', getPaginationSettings);
router.get('/uploadpath', getUploadpathSettings);
router.get('/filesize', getFilesizeSettings);
router.get('/:id', getById);
router.put('/update', updateSchema, update);

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

async function update(req, res, next) {
    try {
        let updates = req.body;

        // Verifica se a entrada está agrupada e precisa ser desmembrada
        /* if (!Array.isArray(updates)) {
            updates = Object.values(updates).flatMap(setting => {
                if (Array.isArray(setting)) {
                    return setting.map(({ id, value }) => ({ id, value }));
                }
                return { id: setting.id, value: setting.value };
            });
        } */

        // Validações no nível do controller
        const validUpdates = updates.filter(({ id, value }) => id && value !== undefined);
        if (validUpdates.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Nenhuma configuração válida foi enviada.' });
        }

        // Processa atualizações individualmente
        const results = await Promise.allSettled(
            validUpdates.map(({ id, value }) =>
                settingService.update(id, { value })
            )
        );

        // Classifica resultados
        const successes = results.filter(result => result.status === 'fulfilled');
        const errors = results.filter(result => result.status === 'rejected');

        // Resposta final
        res.json({
            status: 'partial',
            message: `Configurações processadas: ${successes.length} sucesso(s), ${errors.length} falha(s).`,
            successes: successes.map(s => s.value),
            errors: errors.map(e => e.reason)
        });
    } catch (error) {
        next(error);
    }
}

function updateSchema(req, res, next) {
    console.log(req.body)
    const schema = Joi.array().items(
        Joi.object({
            id: Joi.number(),
            value: Joi.string()
        })
    );
    validateRequest(req, next, schema);
}


function getPaginationSettings(req, res, next) {
    settingService.pagination()
    .then(settings => res.json(settings))
    .catch(next);
}

function getUploadpathSettings(req, res, next) {
    settingService.uploadPath()
    .then(settings => res.json(settings))
    .catch(next);
}


function getFilesizeSettings(req, res, next) {
    settingService.fileSize()
    .then(settings => res.json(settings))
    .catch(next);
}
