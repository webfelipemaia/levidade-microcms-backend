const db = require('../helpers/db.helper');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    createWithSubcategories
};

/**
 * Get all categories with their subcategories.
 * @returns {Promise<Array<Object>>} List of categories with subcategories.
 */
async function getAll() {
    return await db.Category.findAll({ 
        include: [{
            model: db.Category,
            as: 'children'
        }]
    });
}


/**
 * Get a category by its ID.
 * @param {number} id - Category ID.
 * @returns {Promise<Object>} The category with subcategories.
 * @throws {Error} If the category is not found.
 */
async function getById(id) {
    return await getCategory(id);
}

/**
 * Create a new category.
 * @param {Object} params - Category data.
 * @param {string} params.name - Name of the category.
 * @returns {Promise<void>}
 */
async function create(params) {
    const category = new db.Category(params);
    await category.save();
}

/**
 * Update a category by its ID.
 * @param {number} id - Category ID.
 * @param {Object} params - Data to update.
 * @returns {Promise<void>}
 * @throws {Error} If the category is not found.
 */
async function update(id, params) {
    const category = await getCategory(id);
    Object.assign(category, params);
    await category.save();
}

/**
 * Delete a category by its ID.
 * @param {number} id - Category ID.
 * @returns {Promise<void>}
 * @throws {Error} If the category is not found.
 */
async function _delete(id) {
    const category = await getCategory(id);
    await category.destroy();
}

/**
 * Create a category with subcategories in a single transaction.
 * @param {Object} params - Category data.
 * @param {string} params.name - Name of the category.
 * @param {Array<Object>} params.subcategories - List of subcategories to create.
 * @returns {Promise<Object>} The created category with subcategories.
 */
async function createWithSubcategories(params) {
    const category = await db.Category.create({
        name: params.name,
        Subcategories: params.subcategories
    }, {
        include: [db.Subcategory]
    });
    return category;
}

/**
 * Helper: Get a category by ID including its subcategories.
 * Used internally by getById, update, and delete.
 * @private
 * @param {number} id - Category ID.
 * @returns {Promise<Object>} The found category.
 * @throws {Error} If the category is not found.
 */
async function getCategory(id) {
    const category = await db.Category.findByPk(id, { 
        include: [{
            model: db.Category,
            as: 'children'
        }]
    });
    if (!category) throw 'Category not found';
    return category;
}