const { Status } = require('../models');
const logger = require("../config/logger");

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

/**
 * Get all statuses
 */
async function getAll() {
  try {
    const statuses = await Status.findAll();
    return { status: "success", data: statuses };
  } catch (error) {
    logger.error(`[StatusService] Error in getAll: ${error.message}`);
    throw { status: "error", message: "Failed to retrieve statuses." };
  }
}

/**
 * Get status by ID
 */
async function getById(id) {
  return await getName(id);
}

/**
 * Create a new status
 */
async function create(params) {
  try {
    const exists = await Status.findOne({ where: { name: params.name } });
    if (exists) {
      return { status: "error", message: `${params.name} is already registered.` };
    }

    const status = new Status(params);
    await status.save();

    return { status: "success", message: "Status created successfully.", data: status };
  } catch (error) {
    logger.error(`[StatusService] Error in create: ${error.message}`);
    throw { status: "error", message: "Failed to create status." };
  }
}

/**
 * Update a status
 */
async function update(id, params) {
  try {
    const [rowsUpdated] = await Status.update(
      { name: params.name, value: params.value },
      { where: { id } }
    );

    if (rowsUpdated === 0) {
      return { status: "error", message: "Status not found or no changes made." };
    }

    return { status: "success", message: "Status updated successfully." };
  } catch (error) {
    logger.error(`[StatusService] Error in update (ID: ${id}): ${error.message}`);
    return { status: "error", message: "An error occurred while updating the status." };
  }
}

/**
 * Delete a status
 */
async function _delete(id) {
  try {
    const result = await Status.destroy({ where: { id } });

    if (result > 0) {
      return { status: "success", message: "Status successfully deleted." };
    } else {
      return { status: "error", message: "No status found with the given criteria." };
    }
  } catch (error) {
    logger.error(`[StatusService] Error in _delete (ID: ${id}): ${error.message}`);
    return { status: "error", message: `Error deleting status: ${error.message}` };
  }
}

/**
 * Helper: Get status by ID
 */
async function getName(id) {
  try {
    const status = await Status.findByPk(id);
    if (!status) {
      return { status: "error", message: "Status not found." };
    }
    return { status: "success", data: status };
  } catch (error) {
    logger.error(`[StatusService] Error in getName (ID: ${id}): ${error.message}`);
    throw { status: "error", message: "Failed to retrieve status." };
  }
}
