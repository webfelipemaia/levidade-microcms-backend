"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "statuses",
      [
        {
          name: "Trash",
          value: -2,
          description: "Artigo removido e enviado para a lixeira. Pode ser restaurado ou excluído permanentemente.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Archive",
          value: -1,
          description: "Artigo arquivado. Não aparece publicamente, mas permanece disponível internamente.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Unpublish",
          value: 0,
          description: "Artigo salvo como rascunho ou despublicado. Visível apenas para administradores.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Publish",
          value: 1,
          description: "Artigo publicado e visível para todos os usuários.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("statuses", null, {});
  },
};
