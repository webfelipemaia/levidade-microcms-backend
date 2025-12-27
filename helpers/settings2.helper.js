const { SystemSettings } = require('../models');
const { Sequelize } = require("sequelize");
const logger = require("../config/logger");

// Cache in-memory
let cache = null;
let cacheTimestamp = 0;

// Cache lifetime: 5 minutes (default)
const CACHE_TTL = (Number(process.env.CACHE_TTL_MINUTES) || 5) * 60 * 1000;
logger.info(`Settings cache TTL: ${process.env.CACHE_TTL_MINUTES} minutes`);


// Auth configs preserved
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production');
}

module.exports = {
  initializeCache,
  clearCache,
  isCacheValid,
  getCache,
  setCache,
  loadSettings,
  getSettingsByName,
  getSettingsByPrefix,
  normalizeSetting,
  auth: {
    debugMode: parseBool(process.env.AUTH_DEBUG),
    jwtSecret: JWT_SECRET,
    tokenExpiration: process.env.JWT_EXPIRATION || '1h'
  }
};


// Initialize the cache
function initializeCache() {
  cache = null;
  cacheTimestamp = 0;
}

// Clear the cache
function clearCache() {
  initializeCache();
  logger.info('Cache limpo.');
}

// Checks if the cache is still valid
function isCacheValid() {
  return cache && (Date.now() - cacheTimestamp <= CACHE_TTL);
}

// Gets the value from the cache
function getCache() {
  return cache;
}

// Updates cache
function setCache(data) {
  cache = data;
  cacheTimestamp = Date.now();
}

/**
* Convert the DB value to what the application should actually use.
* Official support for the "filesize" category.
 */
function normalizeSetting(row) {
  let value = row.value;
  try {
    // Normaliza para minúsculo antes de comparar
    const category = row.category ? row.category.toLowerCase() : "";

    if (category === "filesize") {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return {
        bytes: Number(parsed.bytes),
        label: parsed.label
      };
    }

    switch (row.type) {
      case "number": return Number(value);
      case "boolean": return value === "true" || value === "1" || value === true;
      case "json":
      case "array": return typeof value === 'string' ? JSON.parse(value) : value;
      default: return value;
    }
  } catch (err) {
    logger.error(`Erro ao converter setting ${row.key}`, err);
    return value;
  }
}

/**
 * Load settings from DB and process into nested object structure
 */
/* async function loadSettings() {
  if (!isCacheValid()) {
    logger.info('Loading system settings...');

    const rows = await SystemSettings.findAll();
    const settings = {};

    for (const row of rows) {
      if (!row.key || row.key.trim() === "") {
        logger.error("Registro de setting sem chave:", row.id);
        continue;
      }

      // Normalize the value before building the tree.
      const value = normalizeSetting(row);

      setNested(settings, row.key, value);
    }

    setCache(settings);
  }

  return getCache();
} */

  async function loadSettings() {
    if (!isCacheValid()) {
      logger.info('Loading system settings...');
  
      const rows = await SystemSettings.findAll();
      const settings = {};
  
      for (const row of rows) {
        if (!row.key || row.key.trim() === "") continue;
  
        const settingData = {
          id: row.id,
          value: normalizeSetting(row)
        };
  
        setNested(settings, row.key, settingData);
      }
  
      setCache(settings);
    }
  
    return getCache();
  }

/**
 * Returns a flat object containing only the keys inside the given prefix.
 */
async function getSettingsByName(settingName) {
  const settings = await loadSettings();

  if (!settings[settingName]) {
    throw new Error(`Setting "${settingName}" not found in cache.`);
  }

  return settings[settingName];
}


/**
 * Returns all settings whose key starts with prefix
 * (mantém comportamento antigo)
 */
async function getSettingsByPrefix(prefix) {
  try {
    
    const settings = await loadSettings();
    const parts = prefix.split('.');
    let result = settings;

    for (const part of parts) {
      if (result && result[part]) {
        result = result[part];
      } else {
        return {};
      }
    }

    return result;
  } catch (error) {
    logger.error("Error searching for settings by prefix:", error);
    throw error;
  }
}


/**
 * Creates nested object structure based on dot notation
 */
function setNested(obj, key, value) {
  if (!key || typeof key !== "string") return;

  const parts = key.split(".");
  let current = obj;

  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      current[part] = value;
    } else {
      if (!current[part]) current[part] = {};
      current = current[part];
    }
  });
}


/** Boolean parser (unchanged) */
function parseBool(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'yes', 'y', 'on'].includes(value.toString().toLowerCase());
}
