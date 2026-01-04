const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const settingService = require('../services/setting.service');
const settingsHelper = require('../helpers/settings2.helper');
const policy = require('../policies/settings.policy');
const logger = require('../config/logger');


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

exports.getByKey = async (req, res) => {
    const settingService = await service.getSetting(req.params.key);
    if (!settingService) return res.status(404).json({ message: "Configuração não encontrada" });
    
    res.json(settingService);
  };
  

exports.updateSetting = async (req, res) => {

  const { key } = req.params;
  const updateData = req.body;

  if (!key) {
      return res.status(400).json({ 
          success: false, 
          message: "Parâmetro 'key' é obrigatório" 
      });
  }

  if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
          success: false, 
          message: "Nenhum dado para atualizar fornecido" 
      });
  }

  try {
      const setting = await settingService.findByKey(key);
      
      if (!setting) {
          return res.status(404).json({ 
              success: false, 
              message: `Configuração com key '${key}' não encontrada` 
          });
      }

      if (!policy.canUpdateSettings(req.user, [setting])) {
          return res.status(403).json({ 
              success: false, 
              message: 'Acesso negado: Configuração restrita a administradores.' 
          });
      }

      const updatedSetting = await settingService.updateItem(setting.id, updateData);
      
      res.json({ 
          success: true,
          message: "Configuração atualizada com sucesso!",
          data: updatedSetting
      });
      
  } catch (error) {
      console.error('Error in updateSetting:', error);
      
      if (error.message.includes('not found')) {
          return res.status(404).json({ 
              success: false, 
              message: error.message 
          });
      }
      
      res.status(500).json({ 
          success: false, 
          message: error.message || "Erro ao atualizar configuração" 
      });
  }
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
        const ids = updates.map(u => u.id);
        const settingsFromDb = await settingService.getSettingKey(ids);
        
        if (!policy.canUpdateSettings(req.user, settingsFromDb)) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Acesso negado: Você tentou alterar configurações críticas restritas a administradores.' 
            });
        }

        const validUpdates = updates.filter(({ id, value }) => id && value !== undefined);
        if (validUpdates.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No valid configuration was sent.' });
        }

        const results = await Promise.allSettled(
            validUpdates.map(({ id, value }) => settingService.update(id, { value }))
        );

        const successes = results.filter(result => result.status === 'fulfilled');
        const errors = results.filter(result => result.status === 'rejected');

        const overallStatus = errors.length === 0 ? 'success' : 'partial';

        res.json({
            status: overallStatus,
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

exports.reloadAll = async (req, res) => {
    try {
      const before = Date.now();

      await settingsHelper.clearCache();
      const newSettings = await settingsHelper.loadSettings();
      global.settings = newSettings;

      const duration = Date.now() - before;

      logger.info(`Settings recarregados manualmente em ${duration}ms`, {
        user: req.user?.id || null,
      });

      return res.json({
        status: "success",
        message: "Settings recarregados com sucesso.",
        durationMs: duration,
        categories: Object.keys(newSettings)
      });
    } catch (err) {
      logger.error("Erro ao recarregar settings manualmente", err);
      return res.status(500).json({
        status: "error",
        message: "Erro ao recarregar settings.",
        error: err.message,
      });
    }
  }

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
            id: Joi.number().required(),
            value: Joi.any().required() 
        })
    );
    validateRequest(req, res, next, schema);
};


const updateSettingSchema = Joi.object({
    value: Joi.any(),
    description: Joi.string().max(500),
    type: Joi.string().valid('string', 'number', 'boolean', 'array', 'json'),
    category: Joi.string().max(100)
}).min(1);

exports.validateUpdateSetting = (req, res, next) => {
    const { error } = updateSettingSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    
    next();
}