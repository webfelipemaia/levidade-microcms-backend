const express = require("express");
const privateSettingRouterV1 = express.Router();
const authenticate = require("../../../middlewares/auth.middleware");
const { checkPermission } = require('../../../middlewares/checkPermission.middleware');
const { reloadACL } = require("../../../helpers/acl.helper");

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

privateSettingRouterV1.get("/", authenticate, checkPermission('settings_read'), getAll);
privateSettingRouterV1.get("/pagination", authenticate, getPaginationSettings);
privateSettingRouterV1.get("/uploadpath", authenticate, getUploadpathSettings);
privateSettingRouterV1.get("/filesize", authenticate, getFilesizeSettings);
//privateSettingRouterV1.get("/:id", authenticate, getById);
privateSettingRouterV1.put("/update", authenticate, updateSchema, update);
privateSettingRouterV1.get('/:id', authenticate, checkPermission('settings_read'), getById);
privateSettingRouterV1.post(
  "/reload-acl",
  checkPermission("settings_manage"),
  async (req, res) => {
    const acl = await reloadACL();
    res.json({ status: "success", message: "ACL reloaded", acl });
  }
);


module.exports = privateSettingRouterV1;
