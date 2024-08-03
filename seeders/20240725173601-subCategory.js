'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Subcategories', [
      {
        name: 'Subcategory 1',
        categoryId: 1,
        createdAt: '2024-07-25 16:00:01',
        updatedAt: '2024-07-25 16:00:01'
      },
      {
        name: 'Subcategory 2',
        categoryId: 2,
        createdAt: '2024-07-25 16:00:01',
        updatedAt: '2024-07-25 16:00:01'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Subcategories', null, {});
  }
};
