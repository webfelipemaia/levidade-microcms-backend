'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('settings', [

      // Básicos do Site
      {
        key: 'site_name',
        type: 'string',
        category: 'Site Identity',
        description: 'O nome do site',
        value: 'Levidade Micro CMS',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'site_description',
        type: 'string',
        category: 'Site Identity',
        description: 'Uma descrição sucinta para o site',
        value: 'Um pequeno gerenciador de conteúdo.',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'site_address',
        type: 'string',
        category: 'Site Identity',
        description: 'O endereço do site',
        value: 'http://localhost:8000',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'site_contact',
        type: 'string',
        category: 'Site Contact',
        description: 'E-mail de contato para assuntos gerais',
        value: 'contact@localhost.com',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'admin_email',
        type: 'string',
        category: 'Site Contact',
        description: 'E-mail para assuntos administrativos do site',
        value: 'admin@localhost.com',
        createdAt: now,
        updatedAt: now
      },

      // Upload Paths
      {
        key: 'upload_path.root',
        type: 'string',
        category: 'Upload Path',
        description: 'Diretório raiz para o armazenamento de arquivos enviados',
        value: '/storage/',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'upload_path.content',
        type: 'string',
        category: 'Upload Path',
        description: 'Caminho para o diretório onde os arquivos relacionados ao conteúdo são armazenados.',
        value: '/storage/content/',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'upload_path.profile',
        type: 'string',
        category: 'Upload Path',
        description: 'Caminho para o diretório onde as imagens de perfil são armazenadas',
        value: '/storage/profile/',
        createdAt: now,
        updatedAt: now
      },

      // Upload Content Types
      {
        key: 'upload_content_type.article',
        type: 'string',
        category: 'Upload Content Type',
        description: 'Para artigos e postagens em geral',
        value: 'article',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'upload_content_type.page',
        type: 'string',
        category: 'Upload Content Type',
        description: 'Para páginas estáticas do site',
        value: 'page',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'upload_content_type.product',
        type: 'string',
        category: 'Upload Content Type',
        description: 'Para produtos e páginas relacionadas',
        value: 'product',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'upload_content_type.rofile',
        type: 'string',
        category: 'Upload Content Type',
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
        category: 'Filesize',
        description: 'Tamanho do arquivo em bytes',
        value: JSON.stringify({ bytes, label }),
        createdAt: now,
        updatedAt: now
      })),

      // Filetype
      {
        key: 'filetype.image',
        type: 'string',
        category: 'Filetype',
        description: 'Formatos permitidos para upload de imagens',
        value: '{"pattern":"/jpeg|jpg|png|gif|ico|webp/"}',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'filetype.video',
        type: 'string',
        category: 'Filetype',
        description: 'Formatos permitidos para upload de vídeos',
        value: '{"pattern":"/avi|wmv|mov|mkv|mp4/"}',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'filetype.text',
        type: 'string',
        category: 'Filetype',
        description: 'Formatos permitidos para upload de documentos e arquivos de texto',
        value: '{"pattern":"/txt|doc|docx|ppt|pptx|xls|xlsx|odt|pdf/"}',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'filetype.compressed',
        type: 'string',
        category: 'Filetype',
        description: 'Formatos permitidos para upload de arquivos compactados',
        value: '{"pattern":"/zip|7z|gz/"}',
        createdAt: now,
        updatedAt: now
      },

      // Pagination
      {
        key: 'pagination.order',
        type: 'json',
        category: 'Pagination',
        description: 'Ordenação padrão para paginação, baseada na data de criação em ordem decrescente',
        value: '["createdAt","DESC"]',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'pagination.page_size',
        type: 'number',
        category: 'Pagination',
        description: 'Número de itens exibidos por página na paginação',
        value: '10',
        createdAt: now,
        updatedAt: now
      },

      // Outros
      {
        key: 'upload.limit',
        type: 'number',
        category: 'Upload Limit',
        description: 'Número de uploads simultâneos permitidos',
        value: '3',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'upload.max_file_size',
        type: 'number',
        category: 'Upload Limit',
        description: 'Tamanho máximo de upload',
        value: '2097152', // 2 MB em bytes
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'upload.required',
        type: 'boolean',
        category: 'Upload Limit',
        description: 'Habilita ou desabilita o upload na criação de artigo. Habilitado por padrão.',
        value: 'true',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'max_avatar_upload',
        type: 'number',
        category: 'Upload Limit',
        description: 'Limitar para os últimos N avatares. 5 por padrão.',
        value: '5',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'rate_limit.public.max',
        type: 'number',
        category: 'Rate Limit',
        description: 'Máximo de requisições públicas por período',
        value: '2',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'rate_limit.public.window',
        type: 'number',
        category: 'Rate Limit',
        description: 'Janela de tempo para rate limit público (em minutos)',
        value: '15',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'rate_limit.private.max',
        type: 'number',
        category: 'Rate Limit',
        description: 'Máximo de requisições privadas por período',
        value: '5',
        createdAt: now,
        updatedAt: now
      },
      {
        key: 'rate_limit.private.window',
        type: 'number',
        category: 'Rate Limit',
        description: 'Janela de tempo para rate limit privado (em minutos)',
        value: '15',
        createdAt: now,
        updatedAt: now
      }

    ], {});   
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('settings', null, {});
  }
};
