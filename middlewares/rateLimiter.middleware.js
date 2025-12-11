const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require('express-rate-limit');

/**
 * Creates a rate limiter middleware using express-rate-limit.
 *
 * @function createLimiter
 * @param {Object} options - Configuration options for the rate limiter.
 * @param {number} options.max - Maximum number of requests allowed within the time window.
 * @param {number} options.windowMs - Duration of the time window in milliseconds.
 * @returns {Function} Express middleware that limits repeated requests from the same IP.
 *
 * @description
 * - Uses a custom `ipKeyGenerator` to generate unique keys per client IP.
 * - Sends standard rate-limit headers (`RateLimit-*`) in the response.
 * - Disables legacy headers (`X-RateLimit-*`).
 * - Returns the message `"Too many requests. Please try again later."` when the limit is reached.
 * - Logs blocked IPs to the console when rate limit is exceeded.
 *
 * @example
 * const express = require('express');
 * const { createLimiter } = require('./middleware/limiter.middleware');
 *
 * const app = express();
 *
 * // Limit to 100 requests per 15 minutes per IP
 * const limiter = createLimiter({ max: 100, windowMs: 15 * 60 * 1000 });
 *
 * app.use('/api', limiter);
 */
function createLimiter({ max, windowMs }) {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: ipKeyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests. Please try again later.",
    handler: (req, res, next, options) => {
      req.appLogger.info(`IP blocked (public): ${req.ip}`);
      res.status(options.statusCode).send(options.message);
    },
  });
}

module.exports = {
  publicLimiter: createLimiter({ max: 2, windowMs: 15*60000 }),
  privateLimiter: createLimiter({ max: 5, windowMs: 15*60000 })
};
