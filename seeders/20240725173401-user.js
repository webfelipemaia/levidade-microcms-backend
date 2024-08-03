'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@example.com',
        password: 'password123', // Idealmente, isso seria um hash seguro
        name: 'Admin',
        lastname: 'User',
        createdAt: '2024-07-25 16:00:01',
        updatedAt: '2024-07-25 16:00:01'
      },
      {
        email: 'user@example.com',
        password: 'password123', // Idealmente, isso seria um hash seguro
        name: 'Regular',
        lastname: 'User',
        createdAt: '2024-07-25 16:00:01',
        updatedAt: '2024-07-25 16:00:01'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
