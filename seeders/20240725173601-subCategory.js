'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Subcategories', [
      {
        name: 'Subcategory 1',
        categoryId: 1,
        created_at: '2024-07-25 16:00:01',
        updated_at: '2024-07-25 16:00:01'
      },
      {
        name: 'Subcategory 2',
        categoryId: 2,
        created_at: '2024-07-25 16:00:01',
        updated_at: '2024-07-25 16:00:01'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Subcategories', null, {});
  }
};
