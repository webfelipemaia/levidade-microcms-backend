'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('articles', [
      {
        title: 'Article 1',
        subtitle: 'Subtitle 1',
        slug: 'article-1',
        body: 'Description for article 1',
        categoryId: 1,
        status: 0,
        featured: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Lorem ipsum',
        subtitle: 'Subtitle 2',
        slug: 'lorem-ipsum',
        body: 'Lorem ipsum dolor site amet',
        categoryId: 2,
        status: 0,
        featured: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('articles', null, {});
  }
};
