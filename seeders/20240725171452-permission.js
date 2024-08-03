'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Permissions', [
      { name: 'CREATE_USER', createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' },
      { name: 'DELETE_USER', createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};
