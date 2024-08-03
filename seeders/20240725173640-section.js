'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Sections', [
      {
        title: 'Section 1',
        subtitle: 'Subtitle 1',
        description: 'Description for Section 1',
        categoryId: 1,
        createdAt: '2024-07-25 16:00:01',
        updatedAt: '2024-07-25 16:00:01'
      },
      {
        title: 'Section 2',
        subtitle: 'Subtitle 2',
        description: 'Description for Section 2',
        categoryId: 2,
        createdAt: '2024-07-25 16:00:01',
        updatedAt: '2024-07-25 16:00:01'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Sections', null, {});
  }
};
