'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users_Roles', [
      { userId: 1, roleId: 1, created_at: '2024-07-25 16:00:01', updated_at: '2024-07-25 16:00:01' }, // Admin
      { userId: 2, roleId: 2, created_at: '2024-07-25 16:00:01', updated_at: '2024-07-25 16:00:01' }  // Regular User
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users_Roles', null, {});
  }
};
