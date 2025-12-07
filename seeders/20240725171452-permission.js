'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      { 
        name: 'CREATE_USER',
        description: 'Permite criar novos usuários no sistema.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        name: 'EDIT_USER',
        description: 'Permite editar informações de qualquer usuário.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        name: 'VIEW_USERS',
        description: 'Permite visualizar a lista de usuários e detalhes básicos.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        name: 'DELETE_USERS',
        description: 'Permite excluir contas de usuários.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
