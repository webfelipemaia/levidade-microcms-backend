const db = require('../helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Section.findAll();
}

async function getById(id) {
    return await getSection(id);
}

async function create(params) {
    const section = new db.Section(params);
    await section.save();
}

async function update(id, params) {
    const section = await getSection(id);
    Object.assign(section, params);
    await section.save();
}

async function _delete(id) {
    const section = await getSection(id);
    await section.destroy();
}

async function getSection(id) {
    const section = await db.Section.findByPk(id);
    if (!section) throw 'Section not found';
    return section;
}
