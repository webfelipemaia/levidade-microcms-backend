// helpers/acl.helper.js
const db = require('./db.helper');
const logger = require('../config/logger');

let ACL_CACHE = null;
let ACL_LAST_LOAD = 0;

const TTL = (Number(process.env.CACHE_TTL_MINUTES) || 5) * 60 * 1000; // 5 minutos

/**
 * Loads the entire ACL from the database and converts it to:
 * {
 *    admin: ["create_article", "delete_user", ...],
 *    editor: ["edit_article"]
 * }
 */
async function loadACL() {
  logger.info("[ACL] Reloading ACL from database...");

  const roles = await db.Role.findAll({
    include: [{ model: db.Permission }]
  });

  const acl = {};

  for (const role of roles) {
    const roleSlug = role.slug;
    const permissions = role.Permissions ? role.Permissions.map(p => p.name) : [];
    acl[roleSlug] = permissions;
  }

  ACL_CACHE = acl;
  ACL_LAST_LOAD = Date.now();

  logger.info("[ACL] Loaded");
  return ACL_CACHE;
}

/**
 * Retorna ACL do cache, recarrega se TTL expirou.
 */
async function getACL() {
  if (!ACL_CACHE || Date.now() - ACL_LAST_LOAD > TTL) {
    await loadACL();
  }
  return ACL_CACHE;
}

/**
 * Forces a manual reload (for admin route)
 */
async function reloadACL() {
  await loadACL();
  return ACL_CACHE;
}

module.exports = { getACL, reloadACL };
