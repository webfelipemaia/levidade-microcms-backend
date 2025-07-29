const express = require("express");
const privateStatusRouterV1 = express.Router();
const authenticate = require("../../../middlewares/auth.middleware");

const {
    getAll,
    getById,
    create,
    update,
    _delete,
} = require("../../../controllers/status.controller");

const {
  createSchema,
  updateSchema,
} = require("../../../controllers/roles.controller");

privateStatusRouterV1.get("/", authenticate, getAll);
privateStatusRouterV1.get("/:id", authenticate, getById);
privateStatusRouterV1.post("/", authenticate, createSchema, create);
privateStatusRouterV1.patch("/:id", authenticate, updateSchema, update);
privateStatusRouterV1.delete("/:id", authenticate, _delete);

module.exports = privateStatusRouterV1;
