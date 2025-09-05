const db = require('../helpers/db.helper');
const logger = require("../config/logger");

/**
 * Middleware generator to check if the authenticated user has a specific permission.
 *
 * @function checkPermission
 * @param {string} permissionName - The name of the permission to be checked against the user's role.
 * @returns {Function} An Express middleware function.
 *
 * @example
 * // Protect a route by requiring the 'edit_article' permission
 * app.get('/articles/:id/edit', checkPermission('edit_article'), (req, res) => {
 *   res.send('You can edit this article!');
 * });
 *
 * @middleware
 * - Expects `req.user` to be populated (e.g., by authentication middleware).
 * - Queries the database to fetch the user, their role, and associated permissions.
 * - Responds with:
 *   - `401 Unauthorized` if the user is not authenticated.
 *   - `403 Forbidden` if the user lacks the required permission.
 *   - Calls `next()` if the user has the permission.
 *
 * @throws {Error} Responds with `500 Internal Server Error` if there is a database or server issue.
 */
function checkPermission(permissionName) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Not authenticated' });

      // Loads the user with the role and permissions
      const user = await db.User.findByPk(userId, {
        include: {
          model: db.Role,
          include: {
            model: db.Permission,
            where: { name: permissionName },
            required: false // to allow filter even if you don't have permission
          }
        }
      });

      const hasPermission = user?.Role?.Permissions?.length > 0;

      if (!hasPermission) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      next();
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'Error checking permissions' });
    }
  };
}

module.exports = { checkPermission };
