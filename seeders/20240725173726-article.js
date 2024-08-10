'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Articles', [
      {
        title: 'Article 1',
        subtitle: 'Subtitle 1',
        slug: 'article-1',
        body: 'Description for article 1',
        categoryId: 1,
        status: 0,
        featured: 0,
        createdAt: '2024-07-25 16:00:01',
        updatedAt: '2024-07-25 16:00:01'
      },
      {
        title: 'Lorem ipsum',
        subtitle: 'Subtitle 2',
        slug: 'lorem-ipsum',
        body: 'Lorem ipsum dolor site amet',
        categoryId: 2,
        status: 0,
        featured: 0,
        createdAt: '2024-07-25 16:00:01',
        updatedAt: '2024-07-25 16:00:01'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {});
  }
};
