'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('roles', [      
      {
        name: 'Guest',
        description: 'Usuário padrão com acesso limitado.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Administrator',
        description: 'O perfil de controle total e manutenção do sistema.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('roles', {
      name: ['Guest','Administrator']
    }, {});
  }
};
