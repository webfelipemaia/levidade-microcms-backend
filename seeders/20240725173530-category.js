'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Categories', [
      { name: 'Categoria Principal', parentId: null, createdAt: now, updatedAt: now },
      { name: 'Subcategoria 1', parentId: 1, createdAt: now, updatedAt: now },
      { name: 'Subcategoria 2', parentId: 1, createdAt: now, updatedAt: now },
      { name: 'Categoria 2', parentId: null, createdAt: now, updatedAt: now },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
