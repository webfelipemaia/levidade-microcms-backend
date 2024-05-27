const db = require('../helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    createWithSubcategories
};

async function getAll() {
    return await db.Category.findAll({ include: db.Subcategory });
}

async function getById(id) {
    return await getCategory(id);
}

async function create(params) {
    const category = new db.Category(params);
    await category.save();
}

async function update(id, params) {
    const category = await getCategory(id);
    Object.assign(category, params);
    await category.save();
}

async function _delete(id) {
    const category = await getCategory(id);
    await category.destroy();
}

async function createWithSubcategories(params) {
    const category = await db.Category.create({
        name: params.name,
        Subcategories: params.subcategories
    }, {
        include: [db.Subcategory]
    });
    return category;
}

async function getCategory(id) {
    const category = await db.Category.findByPk(id, { include: db.Subcategory });
    if (!category) throw 'Category not found';
    return category;
}
