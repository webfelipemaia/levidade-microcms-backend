'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Images', [
      { 
        name: 'user-avatar', 
        path: 'storage/profile/',
        type: 'avatar',
        userId: 1,
        createdAt: '2024-07-25 16:00:01', 
        updatedAt: '2024-07-25 16:00:01' 
      },
      { 
        name: 'user-avatar', 
        path: 'storage/profile/',
        type: 'image',
        userId: 1,
        createdAt: '2024-07-25 16:00:01', 
        updatedAt: '2024-07-25 16:00:01' 
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Images', null, {});
  }
};
