// services/file.service.js
const db = require('../helpers/db.helper');
const fs = require('fs');
const path = require('path');
const logger = require("../config/logger");
const { Op } = require('sequelize'); // Importe o Op para consultas

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    renameAndUpdateFile,
    getByStorageType, // Nova função
    getProfileImages, // Função específica para imagens de perfil
};

/**
 * Get all files.
 * @returns {Promise<Array<Object>>} List of all files.
 */
async function getAll() {
    return await db.File.findAll();
}

/**
 * Get files by storage type/path
 * @param {string} storagePath - Path pattern to search (e.g., 'profile', 'article', 'page')
 * @returns {Promise<Array<Object>>} List of files in the specified storage
 */
async function getByStorageType(storagePath) {
    return await db.File.findAll({
        where: {
            path: {
                [Op.like]: `%${storagePath}%`
            }
        }
    });
}

/**
 * Get profile images specifically
 * @returns {Promise<Array<Object>>} List of profile images
 */
async function getProfileImages() {
    return await getByStorageType('profile');
}

/**
 * Get a file by ID.
 * @param {number} id - File ID.
 * @returns {Promise<Object>} The file record.
 * @throws {Error} If the file is not found.
 */
async function getById(id) {
    return await getFile(id);
}

/**
 * Create a new file record.
 * @param {Object} fileData - File metadata.
 * @param {string} fileData.name - File name.
 * @param {string} fileData.path - File path.
 * @param {number} [fileData.size] - File size (in bytes).
 * @returns {Promise<Object>} The created file.
 */
async function create(fileData, userId = null) {
    try {
        const file = await db.File.create(fileData);

        if (userId) {
            const user = await db.User.findByPk(userId);
            if (user) {
                await user.addFile(file);
                logger.info(`File ${file.id} associated with user ${userId}`);
            }
        } else {
            logger.info('File metadata has been saved but not associated with a user.');
        }
        
        return file;
    } catch (error) {
        logger.error("Erro ao criar arquivo:", error);
        throw error;
    }
}

/**
 * Update a file by its ID.
 * @param {number} id - File ID.
 * @param {Object} params - Fields to update.
 * @returns {Promise<void>}
 * @throws {Error} If the file is not found.
 */
async function update(id, params) {
    const file = await getFile(id);
    Object.assign(file, params);
    await file.save();
}

/**
 * Rename a file in the filesystem and update its metadata in the database.
 * 
 * The new name will be formatted as `[articleId]_[filename].ext`.
 *
 * @param {number} id - File ID.
 * @param {Object} params - Update data.
 * @param {number} params.articleId - ID of the related article.
 * @returns {Promise<string>} The new file name.
 * @throws {Error} If the file has no valid extension or cannot be renamed.
 */
async function renameAndUpdateFile(id, params) {

    const file = await getFile(id);    
    const uploadDir = path.dirname(file.path);
    const fileExtension = path.extname(file.name);
    if (!fileExtension) {
        logger.error("The original file does not have a valid extension.");
        throw new Error("The original file does not have a valid extension.");
    }
    let oldFilePath = file.path;
    if (!oldFilePath.endsWith(fileExtension)) {
        oldFilePath += fileExtension;
    }

    const articleId = params.articleId;
    const fileNameWithoutExt = path.basename(file.name, fileExtension);
    const newFileName = `${articleId}_${fileNameWithoutExt}${fileExtension}`;
    const newFilePath = path.join(uploadDir, newFileName);

    try {
        await fs.promises.rename(oldFilePath, newFilePath);
    } catch (error) {
        logger.error(`Error renaming file: ${error}`);
        throw new Error('Error renaming file (in file system).');
    }

    file.name = newFileName;
    file.path = removeLastSegment(file.path);
    Object.assign(file, params);
    await file.save();

    return newFileName;
}

/**
 * Delete a file by its ID.
 * @param {number} id - File ID.
 * @returns {Promise<void>}
 * @throws {Error} If the file is not found.
 */
async function _delete(id) {
    const file = await getFile(id);
    await file.destroy();
}

/**
 * Helper: Get a file by ID.
 * Used internally by getById, update, renameAndUpdateFile, and delete.
 * @private
 * @param {number} id - File ID.
 * @returns {Promise<Object>} The found file.
 * @throws {Error} If the file is not found.
 */
async function getFile(id) {
    const file = await db.File.findByPk(id);
    if (!file) throw 'File not found';
    return file;
}

/**
 * Helper: Remove the last segment of a file path.
 * Example: "/uploads/articles/file.png" → "/uploads/articles/"
 * @private
 * @param {string} path - Original path.
 * @returns {string} Path without the last segment.
 */
function removeLastSegment(path) {
    if (!path.includes('/')) {
        return path;
    }
    const lastSlashIndex = path.lastIndexOf('/');
    return path.substring(0, lastSlashIndex + 1);
}