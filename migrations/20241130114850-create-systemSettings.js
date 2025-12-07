'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('system_settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      setting_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      setting_value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      additional_value: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
    },
    {
      uniqueKeys: {
        unique_setting_name: {
          customIndex: true,
          fields: ['setting_name', 'setting_value']
        }
      }
    }
  );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('System_Settings');
  }
};