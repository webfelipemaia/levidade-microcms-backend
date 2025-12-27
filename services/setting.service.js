const { SystemSettings } = require('../models');
const settingsHelper = require('../helpers/settings2.helper');
const policy = require('../policies/settings.policy');
const logger = require("../config/logger");

module.exports = {
    getAll,
    getById,
    update,
    pagination,
    uploadPath,
    fileSize,
    getSettingKey,
};

/**
 * Get pagination settings
 */
async function pagination() {
  try {
    const data = await settingsHelper.getSettingsByPrefix('pagination');
    return { status: "success", data };
  } catch (error) {
    logger.error(`[SettingService] Error in pagination: ${error.message}`);
    throw { status: "error", message: "Failed to load pagination settings." };
  }
}

/**
 * Get upload path settings
 */
async function uploadPath() {
  try {
    const data = await settingsHelper.getSettingsByPrefix('upload_path');
    return { status: "success", data };
  } catch (error) {
    logger.error(`[SettingService] Error in uploadPath: ${error.message}`);
    throw { status: "error", message: "Failed to load uploadPath settings." };
  }
}

/**
 * Get filesize settings. 
 */
async function fileSize() {
  try {
    const data = await settingsHelper.getSettingsByPrefix('filesize');
    return { status: "success", data };
  } catch (error) {
    logger.error(`[SettingService] Error in fileSize: ${error.message}`);
    throw { status: "error", message: "Failed to load filesize settings." };
  }
}

/**
 * Get all system settings
 */
async function getAll() {
  try {
    const settings = await settingsHelper.loadSettings();
    return { status: "success", data: settings };
  } catch (error) {
    logger.error(`[SettingService] Error in getAll: ${error.message}`);
    throw { status: "error", message: "Failed to retrieve settings." };
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

    return {
      id,
      status: "success",
      message: `Setting with ID ${id} updated successfully.`,
    };
  } catch (error) {
    logger.error(
      `[SettingService] Error in update (ID: ${id}): ${error.message}`
    );
    
    throw new Error(`Failed to update setting with ID ${id}: ${error.message}`);
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
    return { status: "success", data: setting };
  } catch (error) {
    logger.error(`[SettingService] Error in getName (ID: ${id}): ${error.message}`);
    throw { status: "error", message: "Failed to retrieve setting." };
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
    throw { status: "error", message: "Failed to retrieve setting." };
  }
}