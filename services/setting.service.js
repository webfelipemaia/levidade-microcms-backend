const db = require('../helpers/db.helper');
const settingsHelper = require('../helpers/settings2.helper');
const logger = require("../config/logger");

module.exports = {
    getAll,
    getById,
    update,
    pagination,
    uploadPath,
    fileSize,
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
 * Get uploadPath settings
 */
async function uploadPath() {
  try {
    const data = await settingsHelper.getSettingsByPrefix('uploadPath');
    return { status: "success", data };
  } catch (error) {
    logger.error(`[SettingService] Error in uploadPath: ${error.message}`);
    throw { status: "error", message: "Failed to load uploadPath settings." };
  }
}

/**
 * Get fileSize settings
 */
async function fileSize() {
  try {
    const data = await settingsHelper.getSettingsByName('filesize');
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
    const [rowsUpdated] = await db.SystemSettings.update(
      { value: params.value },
      { where: { id } }
    );

    if (rowsUpdated === 0) {
      return {
        status: "error",
        message: `Setting with ID ${id} not found or not updated.`
      };
    }

    // Após atualizar, recarrega o cache global
    await settingsHelper.clearCache();
    global.settings = await settingsHelper.loadSettings();

    return {
      id,
      status: "success",
      message: `Setting with ID ${id} updated successfully.`
    };
  } catch (error) {
    logger.error(`[SettingService] Error in update (ID: ${id}): ${error.message}`);
    throw { status: "error", message: `Failed to update setting with ID ${id}.` };
  }
}


/**
 * Helper: Get setting by ID
 */
async function getName(id) {
  try {
    const setting = await db.SystemSettings.findByPk(id);
    if (!setting) {
      return { status: "error", message: "Setting not found" };
    }
    return { status: "success", data: setting };
  } catch (error) {
    logger.error(`[SettingService] Error in getName (ID: ${id}): ${error.message}`);
    throw { status: "error", message: "Failed to retrieve setting." };
  }
}