const db = require('./db.helper');
const { Sequelize } = require("sequelize");
const logger = require("../config/logger");

/**
 * In-memory cache
 *
 * @type {*}
 */
let cache = null;
/**
 * Timestamp of last cache load
 *
 * @type {number}
 */
let cacheTimestamp = 0;
/**
 * Cache lifetime: 5 minutes
 *
 * @type {number}
 */
const CACHE_TTL = 5 * 60 * 1000;

module.exports = {
  initializeCache,
  clearCache,
  isCacheValid,
  getCache,
  setCache,
  loadSettings,
  getSettingsByName,
  getSettingsByPrefix,
  auth: {
    debugMode: parseBool(process.env.AUTH_DEBUG),
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    tokenExpiration: process.env.JWT_EXPIRATION || '1h'
  }
};


/** Initialize the cache with default values */
function initializeCache() {
  cache = null;
  cacheTimestamp = 0;
}


/** Clear the cache */
function clearCache() {
  initializeCache();
  logger.info('Cache limpo.');
}

/**
 * Checks if the cache is still valid
 *
 * @returns {boolean} 
 */
function isCacheValid() {
  return cache && Date.now() - cacheTimestamp <= CACHE_TTL;
}

/** Gets the value from the cache */
function getCache() {
  return cache;
}

/**
 * Update the cache with new data and adjust the timestamp
 *
 * @param {*} data 
 */
function setCache(data) {
  cache = data;
  cacheTimestamp = Date.now();
}

/** Loads all database settings with cache support */
async function loadSettings() {
  if (!isCacheValid()) {
    logger.info('Loading database settings...');
    const settings = await db.SystemSettings.findAll();

    const processedSettings = settings.reduce((acc, setting) => {
      let value;
      try {
        value = setting.type === 'json' ? JSON.parse(setting.value) : setting.value;
      } catch (e) {
        logger.error(`Error parsing JSON value to ${setting.settingName}:`, e);
        value = setting.value;
      }

      if (!acc[setting.settingName]) {
        acc[setting.settingName] = [];
      }
      acc[setting.settingName].push({
        value,
        additionalValue: setting.additionalValue,
        type: setting.type,
        description: setting.description,
      });

      return acc;
    }, {});

    setCache(processedSettings);
  }

  return getCache();
}


/**
 * Get specific settings by name
 *
 * @async
 * @param {*} settingName 
 * @returns {unknown} 
 */
async function getSettingsByName(settingName) {
  const settings = await loadSettings();

  if (!settings[settingName]) {
    throw new Error(`Setting "${settingName}" not found in cache.`);
  }

  // Transforms the configuration into a key-value object (additionalValue -> value)
  return settings[settingName].reduce((acc, item) => {
    if (item.additionalValue && item.value !== undefined) {
      acc[item.additionalValue] = item.value;
    }
    return acc;
  }, {});
}


/**
 * Gets specific settings that start with "uploadPath", e.g.
 *
 * @async
 * @param {*} prefix 
 * @returns {unknown} 
 */
async function getSettingsByPrefix(prefix) {
  try {    
    const settings = await db.SystemSettings.findAll({
      where: {
        settingName: {
          [Sequelize.Op.like]: `${prefix}%`
        }
      }
    });

    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.settingName] = {
        value: setting.value,
        additionalValue: setting.additionalValue,
        description: setting.description,
        type: setting.type,
      };
      return acc;
    }, {});

    return settingsObject;
  } catch (error) {
    logger.error("Error searching for settings by prefix:", error);
    throw error;
  }
}


/**
 * Validates the type given in the AUTH_DEBUG definition
 *
 * @param {*} value 
 * @returns {*} 
 */
function parseBool(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'boolean') return value;
  return ['true', 'True', 'TRUE', '1', 'yes', 'y', 'on'].includes(value.toString().toLowerCase());
}
