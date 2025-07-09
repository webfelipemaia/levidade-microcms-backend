const db = require('./db.helper');
const { Sequelize } = require("sequelize"); 

let cache = null; // Cache em memória
let cacheTimestamp = 0; // Timestamp do último carregamento do cache
const CACHE_TTL = 5 * 60 * 1000; // Tempo de vida do cache: 5 minutos

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

// Inicializa o cache com valores padrão
function initializeCache() {
  cache = null;
  cacheTimestamp = 0;
}

// Limpa o cache
function clearCache() {
  initializeCache();
  console.log('Cache limpo.');
}

// Verifica se o cache ainda é válido
function isCacheValid() {
  return cache && Date.now() - cacheTimestamp <= CACHE_TTL;
}

// Obtém o valor do cache
function getCache() {
  return cache;
}

// Atualiza o cache com novos dados e ajusta o timestamp
function setCache(data) {
  cache = data;
  cacheTimestamp = Date.now();
}

// Carrega todas as configurações do banco com suporte a cache
async function loadSettings() {
  if (!isCacheValid()) {
    console.log('Carregando configurações do banco...');
    const settings = await db.SystemSettings.findAll();

    const processedSettings = settings.reduce((acc, setting) => {
      let value;
      try {
        value = setting.type === 'json' ? JSON.parse(setting.value) : setting.value;
      } catch (e) {
        console.error(`Erro ao parsear valor JSON para ${setting.settingName}:`, e);
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

// Obtém configurações específicas por nome
async function getSettingsByName(settingName) {
  const settings = await loadSettings();

  // Verifica se o nome existe
  if (!settings[settingName]) {
    throw new Error(`Configuração "${settingName}" não encontrada no cache.`);
  }

  // Transforma a configuração em um objeto chave-valor (adicionalValue -> value)
  return settings[settingName].reduce((acc, item) => {
    if (item.additionalValue && item.value !== undefined) {
      acc[item.additionalValue] = item.value;
    }
    return acc;
  }, {});
}

// Obtém configurações específicas que começam com "uploadPath", por exemplo
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
    console.error("Erro ao buscar configurações por prefixo:", error);
    throw error;
  }
}

// valida o tipo informado na definição de AUTH_DEBUG
function parseBool(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'boolean') return value;
  return ['true', 'True', 'TRUE', '1', 'yes', 'y', 'on'].includes(value.toString().toLowerCase());
}
