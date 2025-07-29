const express = require("express");
const privateSettingRouterV1 = express.Router();
const authenticate = require("../../../middlewares/auth.middleware");

const {
    getAll,
    getPaginationSettings,
    getUploadpathSettings,
    getFilesizeSettings,
    getById,
    update,
} = require("../../../controllers/settings.controller");

const {
  updateSchema,
} = require("../../../controllers/settings.controller");

privateSettingRouterV1.get("/", authenticate, getAll);
privateSettingRouterV1.get("/pagination", authenticate, getPaginationSettings);
privateSettingRouterV1.get("/uploadpath", authenticate, getUploadpathSettings);
privateSettingRouterV1.get("/filesize", authenticate, getFilesizeSettings);
privateSettingRouterV1.get("/:id", authenticate, getById);
privateSettingRouterV1.put("/updade", authenticate, updateSchema, update);

module.exports = privateSettingRouterV1;
