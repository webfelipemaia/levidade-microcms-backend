const express = require("express");
const privateUserRouterV1 = express.Router();
const auth = require("../../../middlewares/auth.middleware");

const {
    getAll,
    getAllPaginated,
    getUsersRoles,
    getById,
    create,
    update,
    _delete,
    authenticate,
    register,
    setAvatar,
    removeAvatar,
    getAvatar
} = require("../../../controllers/users.controller");

const {
  createSchema,
  registerSchema,
  updateSchema,
} = require("../../../controllers/users.controller");

privateUserRouterV1.get("/", auth, getAll);
privateUserRouterV1.get("/paginated", auth, getAllPaginated);
privateUserRouterV1.get("/roles", auth, getUsersRoles);
privateUserRouterV1.get("/:id", auth, getById);
privateUserRouterV1.post("/", auth, createSchema, create);
privateUserRouterV1.put("/:id", auth, updateSchema, update);
privateUserRouterV1.delete("/:id", auth, _delete);
privateUserRouterV1.post("/authenticate", auth, authenticate);
privateUserRouterV1.post("/register", auth, registerSchema, register);
privateUserRouterV1.put('/:id/avatar', authenticate, setAvatar);
privateUserRouterV1.delete('/:id/avatar', authenticate, removeAvatar);
privateUserRouterV1.get('/:id/avatar', authenticate, getAvatar);

module.exports = privateUserRouterV1;
