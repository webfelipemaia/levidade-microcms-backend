const passport = require('passport');
const config = require('../helpers/settings.helper');
const logger = require("../config/logger");

/**
 * Express middleware for JWT authentication using Passport.js.
 *
 * This middleware validates the presence of a JWT token, either from
 * cookies (`req.cookies.token`) or the `Authorization` header.
 * It uses Passport.js with the "jwt" strategy to authenticate requests.
 *
 * ### Behavior:
 * - Logs incoming cookies and token presence using Winston.
 * - Logs authentication attempts and results (`SUCCESS` or `FAILED`).
 * - If `config.auth.debugMode` is enabled, prints detailed debug information
 *   about the request, headers, Passport.js info, errors, and user data.
 * - If authentication fails, responds with `401 Unauthorized`.
 *   Optionally includes debug details in the response when debug mode is active.
 * - On success, attaches the authenticated `user` object to `req.user` and
 *   calls `next()` to continue the middleware chain.
 *
 * @function authenticate
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware callback.
 *
 * @returns {void} Sends a `401 Unauthorized` response on failure,
 * or passes control to the next middleware on success.
 *
 * @example
 * // Protect a route with JWT authentication
 * const express = require("express");
 * const router = express.Router();
 *
 * router.get("/protected", authenticate, (req, res) => {
 *   res.json({ message: "Access granted", user: req.user });
 * });
 */
const authenticate = (req, res, next) => {
  logger.info('Incoming cookies:', req.cookies);
  logger.info('Token no cookie:', req.cookies?.token);

  logger.info(`[Auth] Attempt at ${new Date().toISOString()} from ${req.ip}`);
  
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    
    logger.info(`[Auth] Result: ${user ? 'SUCCESS' : 'FAILED'}`);

    if (config.auth.debugMode) {
      
      logger.debug('\n=== DEBUG AUTH INFORMATION ===');
      logger.debug('Timestamp:', new Date().toISOString());
      logger.debug('Client IP:', req.ip);
      logger.debug('Request Path:', req.path);
      logger.debug('Headers:', {
        ...req.headers,
        authorization: req.headers.authorization 
        ? `Bearer ***${req.headers.authorization.length - 7} chars` 
        : 'none (using cookie instead)'
      
      });

      if (err) {
        logger.debug('Error Stack:', err.stack || 'No stack available');
      }

      logger.debug('Passport Info:', {
        ...info,
        message: info?.message,
        name: info?.name
      });
      logger.debug('User:', user ? { id: user.id } : 'none');
      logger.debug('==============================\n');
    }

    if (err) return next(err);
    if (!user) {
      // The 401 status was changed to 200 to prevent automatic logging of HTTP requests with errors in the console. 
      // However, changing this status will allow access without authentication.
      return res.status(401).json({
        message: 'Unauthorized',
        ...(config.auth.debugMode && {
          debugInfo: {
            reason: info?.message,
            client: req.ip,
            timestamp: new Date().toISOString()
          }
        })
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};


module.exports = authenticate;