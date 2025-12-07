'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('files', [
      { 
        name: '32d29dbc70b526504748e419f4abb56f.jpg', 
        path: 'storage/content/article/2025_07/32d29dbc70b526504748e419f4abb56f', 
        type: 'image/jpeg',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('files', null, {});
  }
};
