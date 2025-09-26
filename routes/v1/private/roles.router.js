const express = require("express");
const privateRoleRouterV1 = express.Router();
const authenticate = require("../../../middlewares/auth.middleware");

const {
    getAll,
    getAllRolesPermissions,
    getRolesPermissions,
    getById,
    create,
    update,
    _delete,
    createRoleWithPermissions,
    getRolePermissions,
    updateRolePermissions
} = require("../../../controllers/roles.controller");

const {
  createSchema,
  updateSchema,
  updatePermissionsSchema
} = require("../../../controllers/roles.controller");

privateRoleRouterV1.get("/", authenticate, getAll);
privateRoleRouterV1.get("/all", authenticate, getAllRolesPermissions);
privateRoleRouterV1.get("/permissions", authenticate, getRolesPermissions);
privateRoleRouterV1.get("/:id", authenticate, getById);
privateRoleRouterV1.post("/", authenticate, createSchema, create);
privateRoleRouterV1.patch("/:id", authenticate, updateSchema, update);
privateRoleRouterV1.delete("/:id", authenticate, _delete);
privateRoleRouterV1.post("/add-with-permissions",  authenticate, createRoleWithPermissions);
privateRoleRouterV1.get('/:id/permissions',  authenticate, getRolePermissions);
privateRoleRouterV1.patch('/:id/permissions',  authenticate, updatePermissionsSchema, updateRolePermissions);

module.exports = privateRoleRouterV1;
