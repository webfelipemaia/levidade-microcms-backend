'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Files', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.NOW
      },
      updatedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.NOW
      }
    });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Files');     
  }
};
