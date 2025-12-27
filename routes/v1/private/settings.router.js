const express = require("express");
const privateSettingRouterV1 = express.Router();
const authenticate = require("../../../middlewares/auth.middleware");
const { checkPermission } = require('../../../middlewares/checkPermission.middleware');
const policy = require("../../../policies/settings.policy");
const { reloadACL } = require("../../../helpers/acl.helper");
const { invalidateSettingsCache } = require("../../../helpers/settings2.helper");

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

/* privateSettingRouterV1.get("/", authenticate, checkPermission('settings_read'), getAll);
privateSettingRouterV1.get("/pagination", authenticate, getPaginationSettings);
privateSettingRouterV1.get("/uploadpath", authenticate, getUploadpathSettings);
privateSettingRouterV1.get("/filesize", authenticate, getFilesizeSettings);
privateSettingRouterV1.put("/update", authenticate, updateSchema, update);
privateSettingRouterV1.get('/:id', authenticate, checkPermission('settings_read'), getById); */

// Listagem Geral
privateSettingRouterV1.get("/", authenticate, checkPermission(policy.PERMS.READ), getAll);

// Especializadas (Também precisam de permissão de leitura)
privateSettingRouterV1.get("/pagination", authenticate, checkPermission(policy.PERMS.READ), getPaginationSettings);
privateSettingRouterV1.get("/uploadpath", authenticate, checkPermission(policy.PERMS.READ), getUploadpathSettings);
privateSettingRouterV1.get("/filesize", authenticate, checkPermission(policy.PERMS.READ), getFilesizeSettings);

// Update (Protegido por permissão de escrita)
privateSettingRouterV1.put("/update", authenticate, checkPermission(policy.PERMS.UPDATE), updateSchema, update);

// Get Individual
privateSettingRouterV1.get('/:id', authenticate, checkPermission(policy.PERMS.READ), getById);

privateSettingRouterV1.post(
  "/reload-acl",
  checkPermission("settings_manage"),
  async (req, res) => {
    const acl = await reloadACL();
    res.json({ status: "success", message: "ACL reloaded", acl });
  }
);

privateSettingRouterV1.post("/invalidate-cache",
  authenticate, 
  checkPermission('settings_manage'),
  (req, res) => {
  invalidateSettingsCache();
  res.json({ message: "Cache de settings invalidado com sucesso!" });
});

module.exports = privateSettingRouterV1;
