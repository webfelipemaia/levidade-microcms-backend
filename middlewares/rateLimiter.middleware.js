const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require('express-rate-limit');

function createLimiter({ max, windowMs }) {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: ipKeyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests. Please try again later.",
    handler: (req, res, next, options) => {
      console.log(`IP bloqueado (public): ${req.ip}`);
      res.status(options.statusCode).send(options.message);
    },
  });
}

module.exports = {
  publicLimiter: createLimiter({ max: 2, windowMs: 15*60000 }),
  privateLimiter: createLimiter({ max: 5, windowMs: 15*60000 })
};
