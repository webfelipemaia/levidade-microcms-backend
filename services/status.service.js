const db = require('../helpers/db.helper');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    return await db.Status.findAll();
}

async function getById(id) {
    return await getName(id);
}

async function create(params) {
    
    if (await db.Status.findOne({ where: { name: params.name } })) {
        throw { 
            status: 'error', 
            message: params.name + '" is already registered'
        };
    }

    const status = new db.Status(params);
    await status.save();
}

async function update(id, params) {
  try {
      // Updating the status name
      const rowsUpdated = await db.Status.update(
        { name: params.name },
        { value: params.value },
        {
          where: {
            id: id,
          },
        }
      );
  
      return {
          status: "success",
          message: "Status updated successfully."
      };
      
    } catch (error) {
      console.error(error);
      return { status: "error", message: "An error occurred while updating the status." };
    }
  }
    
async function _delete(id) {
    try {
        const result = await db.Status.destroy({
          where: {
            id: id,
          },
        });
      
        if (result > 0) {
            return { 
                status: "success", 
                message: "Status successfully deleted" 
            }
        } else {
            return {
                status: "error",
                message: "No status found with the given criteria"
            }
        }
      } catch (error) {
        return { status: "error", message: `Error deleting status: ${error}` };
      }
}

// helper functions

async function getName(id) {
    const status = await db.Status.findByPk(id);
    if (!status) {
        return { 
            status: "error", 
            message: "Status name not found" 
        }
    } else {
        return { 
            status: "success", 
            data: status 
        }
    }
}
