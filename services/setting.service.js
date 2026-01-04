const { SystemSettings } = require('../models');
const settingsHelper = require('../helpers/settings2.helper');
const policy = require('../policies/settings.policy');
const logger = require("../config/logger");

module.exports = {
    getAll,
    getById,
    update,
    updateItem,
    pagination,
    uploadPath,
    fileSize,
    getSettingKey,
    findByKey,
};

/**
 * Get pagination settings
 */
async function pagination() {
  try {
    const data = await settingsHelper.getSettingsByPrefix('pagination');
    return data;
  } catch (error) {
    logger.error(`[SettingService] Error in pagination: ${error.message}`);
    throw error;
  }
}

/**
 * Get upload path settings
 */
async function uploadPath() {
  try {
    const data = await settingsHelper.getSettingsByPrefix('upload_path');
    return data;
  } catch (error) {
    logger.error(`[SettingService] Error in uploadPath: ${error.message}`);
    throw error;
  }
}

/**
 * Get filesize settings. 
 */
async function fileSize() {
  try {
    const data = await settingsHelper.getSettingsByPrefix('filesize');
    return data;
  } catch (error) {
    logger.error(`[SettingService] Error in fileSize: ${error.message}`);
    throw error;
  }
}

/**
 * Get all system settings
 */
async function getAll() {
  try {
    const settings = await settingsHelper.loadSettings();
    return settings;
  } catch (error) {
    logger.error(`[SettingService] Error in getAll: ${error.message}`);
    throw error;
  }
}


/**
 * Get setting by ID
 */
async function getById(id) {
  return await getName(id);
}

/**
 * Update a system setting
 */
async function update(id, params) {
  try {

    let valueToSave = params.value;
    
    if (valueToSave !== null && typeof valueToSave === "object") {
      valueToSave = JSON.stringify(valueToSave);
    } else if (valueToSave !== undefined) {
      valueToSave = String(valueToSave);
    }

    const [rowsUpdated] = await SystemSettings.update(
      { value: valueToSave },
      { where: { id } }
    );

    if (rowsUpdated === 0) {
      return {
        status: "error",
        message: `Setting with ID ${id} not found or not updated.`,
      };
    }

    // Após atualizar, recarrega o cache global
    await settingsHelper.clearCache();
    global.settings = await settingsHelper.loadSettings();

    return rowsUpdated;
  } catch (error) {
    logger.error(
      `[SettingService] Error in update (ID: ${id}): ${error.message}`
    );
    
    throw new Error(`Failed to update setting with ID ${id}: ${error.message}`);
  }
}

/**
 * Update an item by ID, allowing you to update multiple fields.
 */
async function updateItem(id, updateData) {
  try {

      if (!id || Array.isArray(id)) {
          throw new Error('ID must be a single value, not an array');
      }

      if (!updateData || typeof updateData !== 'object' || Array.isArray(updateData)) {
          throw new Error('Update data must be an object');
      }

      const allowedFields = ['value', 'description', 'type', 'category'];
      const fieldsToUpdate = {};
      
      Object.keys(updateData).forEach(field => {
          if (allowedFields.includes(field) && updateData[field] !== undefined) {
              fieldsToUpdate[field] = updateData[field];
          }
      });

      if (Object.keys(fieldsToUpdate).length === 0) {
          throw new Error('Nenhum campo válido para atualizar. Campos permitidos: ' + allowedFields.join(', '));
      }

      const existingSetting = await SystemSettings.findByPk(id);
      
      if (!existingSetting) {
          throw new Error(`Setting with ID ${id} not found.`);
      }

      if (fieldsToUpdate.value !== undefined) {
          fieldsToUpdate.value = processValueByType(
              fieldsToUpdate.value, 
              existingSetting.type || fieldsToUpdate.type
          );
      }

      const [rowsUpdated] = await SystemSettings.update(
          fieldsToUpdate,
          { where: { id } }
      );

      if (rowsUpdated === 0) {
          throw new Error(`Setting with ID ${id} found but not updated.`);
      }

      const updatedSetting = await SystemSettings.findByPk(id);
      
      // Recarrega o cache global
      await settingsHelper.clearCache();
      global.settings = await settingsHelper.loadSettings();

      return updatedSetting.get({ plain: true });
      
  } catch (error) {
      logger.error(
          `[SettingService] Error in updateItem (ID: ${id}): ${error.message}`
      );
      throw error;
  }
}

/**
* Processes value according to type.
*/
function processValueByType(value, type) {
  
  if (value === null) return null;
  
  if (value === undefined) return value;
  
  switch (type) {
      case 'string':
          return String(value);
          
      case 'number':
          const num = Number(value);
          if (isNaN(num)) {
              throw new Error(`Valor '${value}' não é um número válido para o tipo 'number'`);
          }
          return String(num);
          
      case 'boolean':
          if (typeof value === 'string') {
              const lowerValue = value.toLowerCase();
              if (lowerValue === 'true' || lowerValue === '1') return 'true';
              if (lowerValue === 'false' || lowerValue === '0') return 'false';
              throw new Error(`Valor '${value}' não é um booleano válido`);
          }
          return value ? 'true' : 'false';
          
      case 'array':
          if (!Array.isArray(value)) {
              throw new Error(`Para o tipo 'array', o valor deve ser um array`);
          }
          return JSON.stringify(value);
          
      case 'json':
          if (typeof value !== 'object' && value !== null) {
              throw new Error(`Para o tipo 'json', o valor deve ser um objeto ou array`);
          }
          try {
              if (typeof value === 'string') {
                  JSON.parse(value);
                  return value;
              }
              return JSON.stringify(value);
          } catch (err) {
              throw new Error(`JSON inválido: ${err.message}`);
          }
          
      default:
          return String(value);
  }
}

/**
 * Helper: Get setting by ID
 */
async function getName(id) {
  try {
    const setting = await SystemSettings.findByPk(id);
    if (!setting) {
      return { status: "error", message: "Setting not found" };
    }
    return setting;
  } catch (error) {
    logger.error(`[SettingService] Error in getName (ID: ${id}): ${error.message}`);
    throw error;
  }
}

/**
 * Helper: Get setting key by array of ID's
 */
async function getSettingKey(ids) {
  try {
    return await SystemSettings.findAll({
      where: { id: ids },
      attributes: ['id', 'key']
  });
  } catch (error) {
    logger.error(`[SettingService] Error in getName (ID: ${ids}): ${error.message}`);
    throw error;
  }
}

/**
 * Find a setting by key.
 */
async function findByKey(key) {
  try {
      const setting = await SystemSettings.findOne({ 
          where: { key } 
      });
      
      if (!setting) {
          throw new Error(`Setting with key '${key}' not found`);
      }
      
      return setting.get({ plain: true });
  } catch (error) {
      logger.error(`[SettingService] Error finding by key '${key}': ${error.message}`);
      throw error;
  }
}