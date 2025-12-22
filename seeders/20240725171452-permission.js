'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('permissions', [


    // USERS
    {
      name: 'Create User',
      slug: 'users:create',
      description: 'Allows creating new users.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Read Users',
      slug: 'users:read',
      description: 'Allows viewing users list and user details.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Update User',
      slug: 'users:update',
      description: 'Allows updating user information.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Delete User',
      slug: 'users:delete',
      description: 'Allows deleting user accounts.',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // ROLES
    {
      name: 'Create Role',
      slug: 'roles:create',
      description: 'Allows creating new roles.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Read Roles',
      slug: 'roles:read',
      description: 'Allows viewing roles and their permissions.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Update Role',
      slug: 'roles:update',
      description: 'Allows editing roles and permissions mapping.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Delete Role',
      slug: 'roles:delete',
      description: 'Allows deleting roles.',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // PERMISSIONS
    {
      name: 'Create Permission',
      slug: 'permissions:create',
      description: 'Allows creating new permissions.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Read Permissions',
      slug: 'permissions:read',
      description: 'Allows viewing permissions list.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Update Permission',
      slug: 'permissions:update',
      description: 'Allows editing permissions.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Delete Permission',
      slug: 'permissions:delete',
      description: 'Allows deleting permissions.',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // SETTINGS
    {
      name: 'Read Settings',
      slug: 'settings:read',
      description: 'Allows reading system settings.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Update Settings',
      slug: 'settings:update',
      description: 'Allows updating system settings.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Reload Settings',
      slug: 'settings:reload',
      description: 'Allows manually reloading cached system settings.',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
