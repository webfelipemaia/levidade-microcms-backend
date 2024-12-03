const db = require('../helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

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
