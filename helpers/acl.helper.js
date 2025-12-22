// helpers/acl.helper.js
const { Role, Permission } = require('../models');
const logger = require('../config/logger');

let ACL_CACHE = null;
let ACL_LAST_LOAD = 0;

const TTL = (Number(process.env.CACHE_TTL_MINUTES) || 5) * 60 * 1000; // 5 minutos

/**
 * Loads the entire ACL from the database and converts it to:
 * {
 *    admin: ["articles:create", "users:delete", ...],
 *    editor: ["articles:edit"]
 * }
 */
async function loadACL() {
  logger.info("[ACL] Reloading ACL from database...");

  const roles = await Role.findAll({
    include: [{ model: Permission , as: 'permissions' }]
  });

  const acl = {};

  for (const role of roles) {    
    const roleSlug = role.slug;    
    const permsArray = role.permissions || role.Permissions || [];    
    const permissions = permsArray.map(p => p.slug);
    acl[roleSlug] = permissions;
  }
  
  ACL_CACHE = acl;
  ACL_LAST_LOAD = Date.now();

  logger.info("[ACL] Loaded");
  return ACL_CACHE;
}

/**
 * Returns ACL from cache, reloads if TTL has expired.
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
