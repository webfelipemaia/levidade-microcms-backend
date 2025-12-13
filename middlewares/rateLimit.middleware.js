const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");
const rateLimitService = require("../services/rateLimit.service");
const logger = require("../config/logger");

/**
 * Cria dinamicamente um rate limiter baseado nas configs do settings
 */
function createDynamicLimiter(type = "public") {

  return (req, res, next) => {
    const config = rateLimitService.getRateLimitConfig(type);

    if (!config) {
      logger.warn(`Rate limiter config missing for type '${type}'. Allowing request.`);
      return next();
    }

    const limiter = rateLimit({
      windowMs: config.windowMs,
      max: config.max,
      keyGenerator: ipKeyGenerator,
      standardHeaders: true,
      legacyHeaders: false,
      message: "Too many requests. Please try again later.",
      handler: (req, res, next, options) => {
        req.appLogger.info(`IP blocked (${type}): ${req.ip}`);
        res.status(options.statusCode).send(options.message);
      },
    });

    return limiter(req, res, next);
  };
}

module.exports = {
  publicLimiter: createDynamicLimiter("public"),
  privateLimiter: createDynamicLimiter("private"),
};
