const { getACL } = require("../helpers/acl.helper");
const logger = require("../config/logger");

/**
 * permissionRules can be:
 * - "articles:edit"
 * - ["articles:edit", "articles:delete"]
 * - { any: ["a", "b"] }
 * - { all: ["a", "b"] }
 */

function checkPermission(permissionRules) {
  return async (req, res, next) => {
    try {
      // No permission rules defined
      if (!permissionRules) {
        logger.warn(
          `[ACL] Rota bloqueada: Nenhuma regra de permissão definida para ${req.originalUrl}`
        );
        return res
          .status(403)
          .json({
            error: "Access denied: No permission rules defined for this route.",
          });
      }

      const user = req.user;
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const acl = await getACL();

      const rawRoles = user.roles || user.Roles || [];
      const userRoleSlugs = rawRoles
        .map((role) => {
          if (typeof role === "string") return role.toLowerCase();
          return (
            role.slug ||
            (role.dataValues && role.dataValues.slug) ||
            ""
          ).toLowerCase();
        })
        .filter((s) => !!s);

      // Get permissions
      const userPermissions = new Set();
      for (const roleSlug of userRoleSlugs) {
        const perms = acl[roleSlug] || [];
        perms.forEach((p) => userPermissions.add(p));
      }

      const has = (perm) => userPermissions.has(perm);
      let authorized = false;

      // Validate rules
      if (typeof permissionRules === "string") {
        authorized = has(permissionRules);
      } else if (Array.isArray(permissionRules)) {
        authorized = permissionRules.every(has);
      } else if (permissionRules && permissionRules.any) {
        authorized = permissionRules.any.some(has);
      } else if (permissionRules && permissionRules.all) {
        authorized = permissionRules.all.every(has);
      }

      if (!authorized) {
        logger.warn(
          `[ACL] Acesso negado para User ID ${user.id} na rota ${
            req.originalUrl
          }. Regra: ${JSON.stringify(permissionRules)}`
        );
        return res.status(403).json({ error: "Permission denied" });
      }

      next();
    } catch (err) {
      logger.error(`[checkPermission Error] ${err.stack}`);
      return res
        .status(500)
        .json({ error: "Internal server error during permission check." });
    }
  };
}

module.exports = { checkPermission };
