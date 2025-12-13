const { getACL } = require("../helpers/acl.helper");
const logger = require("../config/logger");

/**
 * permissionRules can be:
 * - "edit_article"
 * - ["edit_article", "delete_article"]
 * - { any: ["a", "b"] }
 * - { all: ["a", "b"] }
 */
function checkPermission(permissionRules) {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const acl = await getACL();
      const userRoles = user.roles || [];

      // Coletar TODAS as permissões do usuário
      const userPermissions = new Set();
      for (const role of userRoles) {
        const perms = acl[role] || [];
        perms.forEach(p => userPermissions.add(p));
      }

      const has = perm => userPermissions.has(perm);

      let authorized = false;

      if (typeof permissionRules === "string") {
        // Regra simples: precisa ter a permissão
        authorized = has(permissionRules);

      } else if (Array.isArray(permissionRules)) {
        // Regra AND implícito: precisa de todas
        authorized = permissionRules.every(has);

      } else if (permissionRules.any) {
        // Regra OR
        authorized = permissionRules.any.some(has);

      } else if (permissionRules.all) {
        // Regra AND explícito
        authorized = permissionRules.all.every(has);
      }

      if (!authorized) {
        return res.status(403).json({ error: "Permission denied" });
      }

      next();

    } catch (err) {
      logger.error(`[checkPermission] ${err.message}`);
      return res.status(500).json({ error: "Error checking permission" });
    }
  };
}

module.exports = { checkPermission };
