const db = require('../helpers/db.helper');
const settingsHelper = require('../helpers/settings.helper');

module.exports = {
    getAll,
    getById,
    update,
    pagination,
    uploadPath,
    fileSize,
};


async function pagination() {
  try {
    return await settingsHelper.getSettingsByPrefix('pagination');
  } catch (error) {
    console.error('Erro ao carregar configuração de paginação:', error);
      throw error;
  }
}

async function uploadPath() {
  try {
    return await settingsHelper.getSettingsByPrefix('uploadPath');
  } catch (error) {
    console.error('Erro ao carregar configuração de uploadPath:', error);
      throw error;
  }
}

async function fileSize() {
  try {
    return await settingsHelper.getSettingsByName('filesize');
  } catch (error) {
    console.error('Erro ao carregar configuração de filesize:', error);
      throw error;
  }
}

async function getAll() {
    return await db.SystemSettings.findAll();
}

async function getById(id) {
    return await getName(id);
}

async function update(id, params) {
  try {
      const rowsUpdated = await db.SystemSettings.update(
          { value: params.value },
          { where: { id } }
      );

      // Verifica se o registro foi encontrado e atualizado
      if (rowsUpdated[0] === 0) {
          throw new Error(`Configuração com ID ${id} não encontrada ou não foi alterada.`);
      }

      return {
          id,
          status: 'success',
          message: `Configuração com ID ${id} atualizada com sucesso.`
      };
  } catch (error) {
      // Retorna erro detalhado para facilitar o debugging
      console.error(`Erro ao atualizar configuração com ID ${id}:`, error);
      throw new Error(`Erro ao atualizar configuração com ID ${id}.`);
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
