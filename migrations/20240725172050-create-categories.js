'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Cria a tabela 'categories' sem a coluna parentId
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // 2. Adiciona a coluna parentId com a referência de chave estrangeira
    await queryInterface.addColumn('categories', 'parentId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { // <-- A chave estrangeira deve estar aqui
        model: 'categories', // Use 'model' para tabelas
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface) {
    // Opcional: Remova a coluna antes de dropar a tabela
    await queryInterface.removeColumn('categories', 'parentId');
    await queryInterface.dropTable('categories');
  },
};
