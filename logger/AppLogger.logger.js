// logger/AppLogger.logger.js
const expressWinston = require("express-winston");
const logger = require("../config/logger");


/**
 * Class for logging
 *
 * @class AppLogger
 * @typedef {AppLogger}
 */
class AppLogger {

  /**
 * Creates an instance of AppLogger.
 * Exposes for manual logs: info/warn/error/debug.
 *
 * @constructor
 * @param {*} app 
 */
constructor(app) {
    this.app = app;
    this.logger = logger;
  }

  // Chamada única no server.js
  /** Description placeholder */
setup() {
    this.logRequests();
    this.logSlowRequests();
    this.logStatusErrors();
    this.logErrors();
    this.handleProcessErrors();
  }

 /**
 * Logs errors that cause failure
 *
 * @param {*} message 
 * @param {{}} [meta={}] 
 */
error(message, meta = {}) {
    this.logger.error(message, meta);
  }
  /**
 * Logs warnings and potential problems
 *
 * @param {*} message 
 * @param {{}} [meta={}] 
 */
warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }
  /**
 * Logs general information
 *
 * @param {*} message 
 * @param {{}} [meta={}] 
 */
info(message, meta = {}) {
    this.logger.info(message, meta);
  }
  /**
 * Detailed logs
 *
 * @param {*} message 
 * @param {{}} [meta={}] 
 */
debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }
  /**
 * Log HTTP Requests
 *
 * @param {*} message 
 * @param {{}} [meta={}] 
 */
http(message, meta = {}) {
    this.logger.info(message, meta);
  }

/** Logs each request with useful meta (ip, route, user-agent) */
logRequests() {
    
    this.app.use(
      expressWinston.logger({
        winstonInstance: this.logger,
        meta: true,
        msg: "HTTP {{req.method}} {{req.url}}",
        expressFormat: false,
        colorize: false,
        dynamicMeta: (req) => ({
          ip: req.ip,
          route: req.originalUrl,
          userAgent: req.headers["user-agent"],
        }),
      })
    );
  }

  /**
 * Records slow request log
 * Execution time can be measured and logged when slow requests occur.
 * @param {number} [thresholdMs=1000] 
 */
logSlowRequests(thresholdMs = 1000) {
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on("finish", () => {
        const duration = Date.now() - start;
        if (duration > thresholdMs) {
          this.warn("Slow request", {
            method: req.method,
            route: req.originalUrl,
            duration,
            status: res.statusCode,
            ip: req.ip,
          });
        }
      });
      next();
    });
  }

  /** 
   * Notify when the response comes out with 4xx/5xx
   * You can use other middleware to check the response status and log data. 
   * 
   */
logStatusErrors() {
    
    this.app.use((req, res, next) => {
      const originalSend = res.send;
      res.send = function (body) {
        if (res.statusCode >= 400) {
          logger.warn("Error response", {
            method: req.method,
            route: req.originalUrl,
            status: res.statusCode,
            ip: req.ip,
          });
        }
        return originalSend.call(this, body);
      };
      next();
    });
  }

  /** Intercepts errors that occur during requests. */
logErrors() {
  
    this.app.use((err, req, res, next) => {
      this.error("Application error", {
        message: err.message,
        stack: err.stack,
        route: req.originalUrl,
        method: req.method,
        ip: req.ip,
        status: err.status || 500,
      });

      // resposta ao cliente
      res.status(err.status || 500).json({
        error: "Internal server error",
      });
    });
  }

  /** Catches any error that "escaped" from middleware and normal application logic */
handleProcessErrors() {
    process.on("uncaughtException", (err) => {
      this.error("Uncaught exception", {
        message: err.message,
        stack: err.stack,
      });
      process.exit(1);
    });

    process.on("unhandledRejection", (reason) => {
      
      if (reason instanceof Error) {
        this.error("Untreated rejected promise", {
          message: reason.message,
          stack: reason.stack,
        });
      } else {
        this.error("Untreated rejected promise", { reason });
      }
    });
  }
}

module.exports = AppLogger;
