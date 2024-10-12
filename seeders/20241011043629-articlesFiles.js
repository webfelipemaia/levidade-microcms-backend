'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users_Articles', [
      { userId: 1, articleId: 1, createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users_Articles', null, {});
  }
};
