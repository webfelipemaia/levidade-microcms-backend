const db = require('../helpers/db.helper');
const Sequelize = require('sequelize');

module.exports = {
    getAll,
    getPaginatedCategories,
    getById,
    create,
    update,
    delete: _delete,
    createWithSubcategories
};

const { paginate } = require('../helpers/pagination.helper');

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

// categoryService.js

/**
 * Get paginated categories with search and ordering
 * @param {number} page - Page number
 * @param {number} pageSize - Number of items per page
 * @param {string} searchQuery - Search query for category name
 * @param {Array} order - Ordering parameters
 * @returns {Promise<Object>} Paginated categories result
 */
async function getPaginatedCategories(page, pageSize, searchQuery, order) {
    // Campos pesquisáveis - apenas name para categories
    const searchFields = ['name'];

    let where = {};

    // Filtros
    if (searchQuery && searchFields.length > 0) {
        where[Sequelize.Op.or] = searchFields.map(field => ({
            [field]: { [Sequelize.Op.like]: `%${searchQuery}%` }
        }));
    }

    return await paginate(db.Category, {
        page,
        pageSize,
        searchQuery,
        searchFields,
        order,
        where
    });
}