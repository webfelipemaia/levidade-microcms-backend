// logger/AppLogger.logger.js
const expressWinston = require("express-winston");
const logger = require("../config/logger");

class AppLogger {
  constructor(app) {
    this.app = app;
    this.logger = logger; // expõe para logs manuais: info/warn/error/debug
  }

  // Chamada única no server.js
  setup() {
    this.logRequests();
    this.logSlowRequests();
    this.logStatusErrors();
    this.logErrors();
    this.handleProcessErrors();
  }

  // ---------- logs manuais (substituem console.log) ----------
  error(message, meta = {}) {
    this.logger.error(message, meta);
  }
  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }
  info(message, meta = {}) {
    this.logger.info(message, meta);
  }
  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }
  http(message, meta = {}) {
    this.logger.info(message, meta);
  }

  // ---------- middlewares ----------
  logRequests() {
    // Loga cada request com meta útil (ip, rota, user-agent)
    this.app.use(
      expressWinston.logger({
        winstonInstance: this.logger,
        meta: true,
        msg: "HTTP {{req.method}} {{req.url}}",
        expressFormat: false,
        colorize: false, // o colorize é tratado no transport do console
        dynamicMeta: (req) => ({
          ip: req.ip,
          route: req.originalUrl,
          userAgent: req.headers["user-agent"],
        }),
      })
    );
  }

  logSlowRequests(thresholdMs = 1000) {
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on("finish", () => {
        const duration = Date.now() - start;
        if (duration > thresholdMs) {
          this.warn("Requisição lenta", {
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

  logStatusErrors() {
    // Avisa quando a resposta sair com 4xx/5xx
    this.app.use((req, res, next) => {
      const originalSend = res.send;
      res.send = function (body) {
        if (res.statusCode >= 400) {
          logger.warn("Resposta com erro", {
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

  logErrors() {
    // Middleware de erro do Express (tem 4 args!)
    this.app.use((err, req, res, next) => {
      this.error("Erro de aplicação", {
        message: err.message,
        stack: err.stack,
        route: req.originalUrl,
        method: req.method,
        ip: req.ip,
        status: err.status || 500,
      });

      // resposta ao cliente
      res.status(err.status || 500).json({
        error: "Erro interno no servidor",
      });
    });
  }

  handleProcessErrors() {
    process.on("uncaughtException", (err) => {
      this.error("Exceção não capturada", {
        message: err.message,
        stack: err.stack,
      });
      process.exit(1);
    });

    process.on("unhandledRejection", (reason) => {
      
      if (reason instanceof Error) {
        this.error("Promise rejeitada não tratada", {
          message: reason.message,
          stack: reason.stack,
        });
      } else {
        this.error("Promise rejeitada não tratada", { reason });
      }
    });
  }
}

module.exports = AppLogger;
