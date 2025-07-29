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
    createRolesWithPermissions,
} = require("../../../controllers/roles.controller");

const {
  createSchema,
  updateSchema,
} = require("../../../controllers/roles.controller");

privateRoleRouterV1.get("/", authenticate, getAll);
privateRoleRouterV1.get("/all", authenticate, getAllRolesPermissions);
privateRoleRouterV1.get("/roles", authenticate, getRolesPermissions);
privateRoleRouterV1.get("/:id", authenticate, getById);
privateRoleRouterV1.post("/", authenticate, createSchema, create);
privateRoleRouterV1.patch("/:id", authenticate, updateSchema, update);
privateRoleRouterV1.delete("/:id", authenticate, _delete);
privateRoleRouterV1.post("/add",  authenticate,  createRolesWithPermissions);

module.exports = privateRoleRouterV1;
