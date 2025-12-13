// services/rateLimit.service.js
const logger = require("../config/logger");

class RateLimitService {

  /**
   * Retorna a configuração de rate limit para public/private
   * @param {'public'|'private'} type
   */
  getRateLimitConfig(type = "public") {
    try {
      const settings = global.settings?.rate_limit;
      if (!settings || !settings[type]) {
        logger.warn(`RateLimit config for type '${type}' not found`);
        return null;
      }

      return {
        max: Number(settings[type].max || 0),
        windowMs: Number(settings[type].window || 1) * 60 * 1000, // minutos → ms
      };
    } catch (err) {
      logger.error("Error retrieving rate limit config", err);
      return null;
    }
  }

  /**
   * Retorna todas as configs estruturadas
   */
  getAllRateLimitConfigs() {
    try {
      const settings = global.settings?.rate_limit;
      if (!settings) return {};

      return {
        public: {
          max: Number(settings.public?.max || 0),
          windowMs: Number(settings.public?.window || 1) * 60 * 1000,
        },
        private: {
          max: Number(settings.private?.max || 0),
          windowMs: Number(settings.private?.window || 1) * 60 * 1000,
        }
      };
    } catch (err) {
      logger.error("Error retrieving all rate limit configs", err);
      return {};
    }
  }
}

module.exports = new RateLimitService();
