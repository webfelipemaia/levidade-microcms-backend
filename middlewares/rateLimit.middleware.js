const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit"); 
const rateLimitService = require("../services/rateLimit.service");
const logger = require("../config/logger");

/**
 * Cria o rate limiter na inicialização com lógica dinâmica
 */
function createDynamicLimiter(type = "public") {
  return rateLimit({
    
    windowMs: (req) => {
      const config = rateLimitService.getRateLimitConfig(type);
      return config ? config.windowMs : 15 * 60 * 1000;
    },
    
    limit: (req) => {
      const config = rateLimitService.getRateLimitConfig(type);
      return config ? config.max : 100;
    },
    // Use o helper oficial para evitar o erro de IPv6
    keyGenerator: ipKeyGenerator, 
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests. Please try again later.",
    handler: (req, res, next, options) => {
      const log = req.appLogger || logger;
      log.info(`IP blocked (${type}): ${req.ip}`);
      res.status(options.statusCode).send(options.message);
    },
    // Silencia o aviso caso você esteja atrás de um Proxy
    validate: { xForwardedForHeader: false }, 
  });
}

module.exports = {
  publicLimiter: createDynamicLimiter("public"),
  privateLimiter: createDynamicLimiter("private"),
};