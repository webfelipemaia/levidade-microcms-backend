'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [      
      
      {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin',
        lastname: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'guest@example.com',
        password: 'password123',
        name: 'Guest',
        lastname: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
