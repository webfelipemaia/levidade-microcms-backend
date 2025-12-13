'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles_permissions', [


      // ADMIN (roleId = 2)


      // USERS
      { roleId: 2, permissionId: 1, createdAt: new Date(), updatedAt: new Date() }, // user_create
      { roleId: 2, permissionId: 2, createdAt: new Date(), updatedAt: new Date() }, // user_read
      { roleId: 2, permissionId: 3, createdAt: new Date(), updatedAt: new Date() }, // user_update
      { roleId: 2, permissionId: 4, createdAt: new Date(), updatedAt: new Date() }, // user_delete

      // ROLES
      { roleId: 2, permissionId: 5, createdAt: new Date(), updatedAt: new Date() }, // roles_create
      { roleId: 2, permissionId: 6, createdAt: new Date(), updatedAt: new Date() }, // roles_read
      { roleId: 2, permissionId: 7, createdAt: new Date(), updatedAt: new Date() }, // roles_update
      { roleId: 2, permissionId: 8, createdAt: new Date(), updatedAt: new Date() }, // roles_delete

      // PERMISSIONS
      { roleId: 2, permissionId: 9, createdAt: new Date(), updatedAt: new Date() },  // permissions_create
      { roleId: 2, permissionId: 10, createdAt: new Date(), updatedAt: new Date() }, // permissions_read
      { roleId: 1, permissionId: 11, createdAt: new Date(), updatedAt: new Date() }, // permissions_update
      { roleId: 2, permissionId: 12, createdAt: new Date(), updatedAt: new Date() }, // permissions_delete

      // SETTINGS
      { roleId: 2, permissionId: 13, createdAt: new Date(), updatedAt: new Date() }, // settings_read
      { roleId: 2, permissionId: 14, createdAt: new Date(), updatedAt: new Date() }, // settings_update
      { roleId: 2, permissionId: 15, createdAt: new Date(), updatedAt: new Date() }, // settings_reload



      // GUEST (roleId = 1)


      // Read-only access
      { roleId: 1, permissionId: 2, createdAt: new Date(), updatedAt: new Date() },  // user_read
      { roleId: 1, permissionId: 6, createdAt: new Date(), updatedAt: new Date() },  // roles_read
      { roleId: 1, permissionId: 10, createdAt: new Date(), updatedAt: new Date() }, // permissions_read
      { roleId: 1, permissionId: 13, createdAt: new Date(), updatedAt: new Date() }, // settings_read

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles_permissions', null, {});
  }
};
