'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Documents', [
      {
        title: 'Document 1',
        subtitle: 'Subtitle 1',
        description: 'Description for document 1',
        categoryId: 1,
        created_at: '2024-07-25 16:00:01',
        updated_at: '2024-07-25 16:00:01'
      },
      {
        title: 'Document 2',
        subtitle: 'Subtitle 2',
        description: 'Description for document 2',
        categoryId: 2,
        created_at: '2024-07-25 16:00:01',
        updated_at: '2024-07-25 16:00:01'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Documents', null, {});
  }
};
