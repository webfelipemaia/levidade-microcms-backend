const Sequelize = require('sequelize');

/**
 * Generic pagination for any Sequelize entity.
 *
 * @param {Object} model - The Sequelize model (e.g., User, Article).
 * @param {Object} options - Pagination and filter options.
 * @param {number} options.page - Current page.
 * @param {number} options.pageSize - Page size.
 * @param {Object} [options.where] - WHERE clause with filters (PRINCIPAL CORREÇÃO).
 * @param {Array} [options.order] - Ordering (e.g., [['createdAt', 'DESC']]).
 * @returns {Object} - Paginated results.
 */
async function paginate(model, { 
    page = 1, 
    pageSize = global.settings.pagination.pagesize || 10, 
    where = {},
    order = [global.settings.pagination.orderby || ['createdAt', 'DESC']] 
}) {
    
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    const result = await model.findAndCountAll({
        where,
        limit,
        offset,
        order
    });

    return {
        total: result.count,
        totalPages: Math.ceil(result.count / pageSize),
        currentPage: page,
        data: result.rows
    };
}


module.exports = {
    paginate
};
