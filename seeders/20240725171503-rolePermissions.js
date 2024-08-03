'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles_Permissions', [
      { roleId: 1, permissionId: 1, createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' },
      { roleId: 1, permissionId: 2, createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles_Permissions', null, {});
  }
};
