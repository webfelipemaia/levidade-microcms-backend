'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Files', [
      { name: 'example-image', path: 'path/to/image/', createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' },
      { name: 'second-example-img', path: 'path/to/second/image/', createdAt: '2024-07-25 16:00:01', updatedAt: '2024-07-25 16:00:01' },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Files', null, {});
  }
};
