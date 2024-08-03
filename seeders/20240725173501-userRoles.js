'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users_Roles', [
      { userId: 1, roleId: 1, createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' }, // Admin
      { userId: 2, roleId: 2, createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' }  // Regular User
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users_Roles', null, {});
  }
};
