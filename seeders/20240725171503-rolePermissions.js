'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles_Permissions', [
      { roleId: 1, permissionId: 1, created_at: '2024-07-25 16:00:01', updated_at: '2024-07-25 16:00:01' },
      { roleId: 1, permissionId: 2, created_at: '2024-07-25 16:00:01', updated_at: '2024-07-25 16:00:01' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles_Permissions', null, {});
  }
};
