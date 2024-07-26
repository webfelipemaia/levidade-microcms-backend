'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Items', [
      {
        title: 'Item 1',
        subtitle: 'Subtitle 1',
        description: 'Description for Item 1',
        sectionId: 1,
        created_at: '2024-07-25 16:00:01',
        updated_at: '2024-07-25 16:00:01'
      },
      {
        title: 'Item 2',
        subtitle: 'Subtitle 2',
        description: 'Description for Item 2',
        sectionId: 2,
        created_at: '2024-07-25 16:00:01',
        updated_at: '2024-07-25 16:00:01'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {});
  }
};
