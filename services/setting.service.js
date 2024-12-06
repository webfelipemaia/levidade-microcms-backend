const db = require('../helpers/db.helper');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    loadSettings,
    clearCache
};

let cache = null; // Cache em memória
let cacheTimestamp = 0; // Timestamp do último carregamento do cache
const CACHE_TTL = 5 * 60 * 1000; // Tempo de vida do cache: 5 minutos

async function loadSettings() {
  // Recarrega configurações do banco apenas se o cache estiver expirado
  if (!cache || Date.now() - cacheTimestamp > CACHE_TTL) {
    console.log('Carregando configurações do banco...');
    const settings = await db.SystemSettings.findAll();

    // Transforma o resultado em um objeto onde cada `settingName` contém uma lista de valores
    cache = settings.reduce((acc, setting) => {
      let value;
      try {
        // Converte valores JSON automaticamente, dependendo do tipo
        value = setting.type === 'json' ? JSON.parse(setting.value) : setting.value;
      } catch (e) {
        console.error(`Erro ao parsear valor JSON para ${setting.settingName}:`, e);
        value = setting.value; // Se falhar, mantém o valor original
      }

      // Adiciona o setting ao array correspondente ao `settingName`, ou cria um novo array se ainda não existir
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

    cacheTimestamp = Date.now(); // Atualiza o timestamp do cache
  }

  return cache;
}

// Função para limpar o cache (caso necessário)
function clearCache() {
  cache = null;
  cacheTimestamp = 0;
  console.log('Cache limpo.');
}

async function getAll() {
    return await db.SystemSettings.findAll();
}

async function getById(id) {
    return await getName(id);
}

async function create(params) {
    
    if (await db.SystemSettings.findOne({ where: { settingName: params.settingName } })) {
        throw { 
            status: 'error', 
            message: params.settingName + '" is already registered'
        };
    }

    const status = new db.SystemSettings(params);
    await status.save();
}

async function update(id, params) {
  try {
      // Updating the setting item
      const rowsUpdated = await db.SystemSettings.update(
        { settingName: params.settingName },
        { value: params.value },
        { additionalValue: params.additionalValue },
        { description: params.description },
        { type: params.type },
        {
          where: {
            id: id,
          },
        }
      );
  
      return {
          status: "success",
          message: "Setting updated successfully."
      };
      
    } catch (error) {
      console.error(error);
      return { status: "error", message: "An error occurred while updating the setting item." };
    }
  }
    
async function _delete(id) {
    try {
        const result = await db.SystemSettings.destroy({
          where: {
            id: id,
          },
        });
      
        if (result > 0) {
            return { 
                status: "success", 
                message: "Setting successfully deleted" 
            }
        } else {
            return {
                status: "error",
                message: "No setting found with the given criteria"
            }
        }
      } catch (error) {
        return { status: "error", message: `Error deleting setting: ${error}` };
      }
}

// helper functions

async function getName(id) {
    const status = await db.SystemSettings.findByPk(id);
    if (!status) {
        return { 
            status: "error", 
            message: "Setting name not found" 
        }
    } else {
        return { 
            status: "success", 
            data: status 
        }
    }
}
