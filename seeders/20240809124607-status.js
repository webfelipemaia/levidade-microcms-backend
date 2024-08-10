'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Statuses', [
      { name: 'Trash', value: -2, createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01'},
      { name: 'Archive', value: -1, createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' },
      { name: 'Unpublish', value: 0, createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' },
      { name: 'Publish', value: 1, createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' },
    ], {});
    
  },

  async down (queryInterface, Sequelize) {    
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
