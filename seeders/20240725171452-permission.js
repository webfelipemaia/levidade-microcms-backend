'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('permissions', [


      // USERS

      {
        name: 'user_create',
        description: 'Allows creating new users.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_read',
        description: 'Allows viewing users list and user details.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_update',
        description: 'Allows updating user information.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_delete',
        description: 'Allows deleting user accounts.',
        createdAt: new Date(),
        updatedAt: new Date()
      },


      // ROLES
      {
        name: 'roles_create',
        description: 'Allows creating new roles.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'roles_read',
        description: 'Allows viewing roles and their permissions.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'roles_update',
        description: 'Allows creating and editing roles and permissions.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'roles_delete',
        description: 'Allows deleting roles.',
        createdAt: new Date(),
        updatedAt: new Date()
      },


      // PERMISSIONS
      {
        name: 'permissions_create',
        description: 'Allows creating new permissions.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'permissions_read',
        description: 'Allows viewing permissions list.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'permissions_update',
        description: 'Allows creating and editing permissions.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'permissions_delete',
        description: 'Allows deleting permissions.',
        createdAt: new Date(),
        updatedAt: new Date()
      },


      // SETTINGS

      {
        name: 'settings_read',
        description: 'Allows reading system settings.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'settings_update',
        description: 'Allows updating system settings.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'settings_reload',
        description: 'Allows manually reloading cached system settings.',
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
