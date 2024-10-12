'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users_Files', [
      { userId: 1, fileId: 1, createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users_Files', null, {});
  }
};
