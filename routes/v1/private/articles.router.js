const express = require("express");
const privateArticleRouterV1 = express.Router();
const authenticate = require("../../../middlewares/auth.middleware");
const loadSettings = require("../../../middlewares/setting.middleware");

const {
  getAll,
  getLastRegister,
  getAllPaginated,
  getById,
  create,
  createAndReturnId,
  update,
  _delete,
} = require("../../../controllers/articles.controller");

const {
  createSchema,
  updateSchema,
} = require("../../../controllers/articles.controller");

privateArticleRouterV1.get("/", authenticate, getAll);
privateArticleRouterV1.get("/last", authenticate, getLastRegister);
privateArticleRouterV1.get("/paginated", authenticate, getAllPaginated);
privateArticleRouterV1.get("/:id", authenticate, getById);
privateArticleRouterV1.post("/", authenticate, loadSettings, createSchema, create);
privateArticleRouterV1.post("/create-with-return",  authenticate,  createSchema,  createAndReturnId);
privateArticleRouterV1.patch("/:id", authenticate, updateSchema, update);
privateArticleRouterV1.delete("/:id", authenticate, _delete);

module.exports = privateArticleRouterV1;
