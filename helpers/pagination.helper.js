const Sequelize = require('sequelize');

/**
 * Paginação genérica para qualquer entidade Sequelize.
 *
 * @param {Object} model - O modelo Sequelize (ex: User, Article).
 * @param {Object} options - Opções de paginação e filtros.
 * @param {number} options.page - Página atual.
 * @param {number} options.pageSize - Tamanho da página.
 * @param {Object} [options.searchFields] - Campos para realizar buscas (ex: { name: "John" }).
 * @param {string} [options.searchQuery] - Texto de busca.
 * @param {Array} [options.order] - Ordenação (ex: [['createdAt', 'DESC']]).
 * @returns {Object} - Resultados paginados.
 */
async function paginate(model, { page = 1, pageSize = 10, searchFields = [], searchQuery = '', order = [['createdAt', 'DESC']] }) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    let where = {};
    if (searchQuery && searchFields.length > 0) {
        where = {
            [Sequelize.Op.or]: searchFields.map(field => ({
                [field]: { [Sequelize.Op.like]: `%${searchQuery}%` }
            }))
        };
    }

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
