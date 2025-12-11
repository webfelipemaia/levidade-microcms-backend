'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('settings', [

      // Básicos do Site
      {
        key: 'sitename.default',
        type: 'string',
        category: 'siteName',
        description: 'O nome do site',
        value: 'Levidade Micro CMS',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'sitedescription.default',
        type: 'string',
        category: 'siteDescription',
        description: 'Uma descrição sucinta para o site',
        value: 'Um pequeno gerenciador de conteúdo.',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'siteaddress.default',
        type: 'string',
        category: 'siteAddress',
        description: 'O endereço do site',
        value: 'http://localhost:8000',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'sitecontact.default',
        type: 'string',
        category: 'siteContact',
        description: 'E-mail de contato para assuntos gerais',
        value: 'contact@localhost.com',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'adminemail.default',
        type: 'string',
        category: 'adminEmail',
        description: 'E-mail para assuntos admnistrativos do site',
        value: 'admin@localhost.com',
        createdAt: now,
        updatedAt: now
      },

      // Upload Paths
      {
        key: 'uploadpathroot.default',
        type: 'string',
        category: 'uploadPathRoot',
        description: 'Diretório raiz para o armazenamento de arquivos enviados',
        value: '/storage/',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'uploadpathcontent.default',
        type: 'string',
        category: 'uploadPathContent',
        description: 'Caminho para o diretório onde os arquivos relacionados ao conteúdo são armazenados.',
        value: '/storage/content/',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'uploadpathprofile.default',
        type: 'string',
        category: 'uploadPathProfile',
        description: 'Caminho para o diretório onde as imagens de perfil são armazenadas',
        value: '/storage/profile/',
        createdAt: now,
        updatedAt: now
      },

      // Upload Content Types
      {
        key: 'uploadcontenttype.article',
        type: 'string',
        category: 'uploadContentType',
        description: 'Para artigos e postagens em geral',
        value: 'article',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'uploadcontenttype.page',
        type: 'string',
        category: 'uploadContentType',
        description: 'Para páginas estáticas do site',
        value: 'page',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'uploadcontenttype.product',
        type: 'string',
        category: 'uploadContentType',
        description: 'Para produtos e páginas relacionadas',
        value: 'product',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'uploadcontenttype.profile',
        type: 'string',
        category: 'uploadContentType',
        description: 'Para perfis de usuários',
        value: 'profile',
        createdAt: now,
        updatedAt: now
      },

      // Filesize
      ...[
        ['250_kb', '256000', '250 KB'],
        ['500_kb', '512000', '500 KB'],
        ['1_mb', '1048576', '1 MB'],
        ['2_mb', '2097152', '2 MB'],
        ['4_mb', '4194304', '4 MB'],
        ['8_mb', '8388608', '8 MB'],
        ['16_mb', '16777216', '16 MB'],
        ['32_mb', '33554432', '32 MB'],
        ['64_mb', '67108864', '64 MB'],
        ['128_mb', '134217728', '128 MB'],
        ['256_mb', '268435456', '256 MB'],
        ['512_mb', '536870912', '512 MB'],
        ['1_gb', '1073741824', '1 GB'],
        ['2_gb', '2147483648', '2 GB']
      ].map(([suffix, bytes, label]) => ({
        key: `filesize.${suffix}`,
        type: 'number',
        category: 'filesize',
        description: 'Tamanho do arquivo em bytes',
        value: JSON.stringify({ bytes, label }),
        createdAt: now,
        updatedAt: now
      })),

      // Filetype
      {
        key: 'filetype.image',
        type: 'string',
        category: 'filetype',
        description: 'Formatos permitidos para upload de imagens',
        value: '{"pattern":"/jpeg|jpg|png|gif|ico|webp/"}',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'filetype.video',
        type: 'string',
        category: 'filetype',
        description: 'Formatos permitidos para upload de vídeos',
        value: '{"pattern":"/avi|wmv|mov|mkv|mp4/"}',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'filetype.text',
        type: 'string',
        category: 'filetype',
        description: 'Formatos permitidos para upload de documentos e arquivos de texto',
        value: '{"pattern":"/txt|doc|docx|ppt|pptx|xls|xlsx|odt|pdf/"}',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'filetype.compressed',
        type: 'string',
        category: 'filetype',
        description: 'Formatos permitidos para upload de arquivos compactados',
        value: '{"pattern":"/zip|7z|gz/"}',
        createdAt: now,
        updatedAt: now
      },

      // Pagination
      {
        key: 'pagination.order',
        type: 'json',
        category: 'pagination',
        description: 'Ordenação padrão para paginação, baseada na data de criação em ordem decrescente',
        value: '["createdAt","DESC"]',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'pagination.pagesize',
        type: 'number',
        category: 'pagination',
        description: 'Número de itens exibidos por página na paginação',
        value: '10',
        createdAt: now,
        updatedAt: now
      },

      // Outros
      {
        key: 'uploadlimit.default',
        type: 'number',
        category: 'uploadLimit',
        description: 'Número de uploads simultâneos permitidos',
        value: '3',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'uploadmaxfilesize.default',
        type: 'number',
        category: 'uploadMaxFileSize',
        description: 'Tamanho máximo de upload',
        value: '2097152', // 2 MB em bytes
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'uploadrequired.default',
        type: 'boolean',
        category: 'uploadRequired',
        description: 'Habilita ou desabilita o upload na criação de artigo. Habilitado por padrão.',
        value: 'true',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'maxavatarupload.default',
        type: 'number',
        category: 'maxAvatarUpload',
        description: 'Limitar para os últimos N avatares. 5 por padrão.',
        value: '5',
        createdAt: now,
        updatedAt: now
      }

    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('settings', null, {});
  }
};
