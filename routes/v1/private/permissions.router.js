const express = require("express");
const privatePermissionRouterV1 = express.Router();
const authenticate = require("../../../middlewares/auth.middleware");

const {
    getAll,
    getAllPermissionsRoles,
    getPermissionsRoles,
    getById,
    create,
    update,
    _delete,
    addPermissionsToRole,
} = require("../../../controllers/permissions.controller");

const {
  createSchema,
  updateSchema,
} = require("../../../controllers/permissions.controller");

privatePermissionRouterV1.get("/", authenticate, getAll);
privatePermissionRouterV1.get("/all", authenticate, getAllPermissionsRoles);
privatePermissionRouterV1.get("/roles", authenticate, getPermissionsRoles);
privatePermissionRouterV1.get("/:id", authenticate, getById);
privatePermissionRouterV1.post("/", authenticate, createSchema, create);
privatePermissionRouterV1.patch("/:id", authenticate, updateSchema, update);
privatePermissionRouterV1.delete("/:id", authenticate, _delete);
privatePermissionRouterV1.post("/add",  authenticate,  addPermissionsToRole);

module.exports = privatePermissionRouterV1;
