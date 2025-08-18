// config/logger.js
const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");

// ---- Configs vindas do seu modelo ----
const settings = {
  level: process.env.LOG_LEVEL || "info", // error, warn, info, debug
  useColors: process.env.LOG_COLORS === "true" || true, // habilitar/desabilitar cores
  output: process.env.LOG_OUTPUT || "console", // console | file | both
  format: process.env.LOG_FORMAT || "json", // json | text
  dateFormat: process.env.LOG_DATE_FORMAT || "YYYY-MM-DD HH:mm:ss",
  logDir: path.join(__dirname, "../logs"),
  fileName: "app.log",
};

// Garante a pasta de logs (se for escrever em arquivo)
if ((settings.output === "file" || settings.output === "both") && !fs.existsSync(settings.logDir)) {
  fs.mkdirSync(settings.logDir, { recursive: true });
}

// Formatação base (timestamp + stack)
const base = [
  format.timestamp({ format: settings.dateFormat }),
  format.errors({ stack: true }),
];

// Console: JSON ou texto (com cores opcionais)
const consoleFormat = settings.format === "json"
  ? format.combine(...base, format.json())
  : format.combine(
      ...base,
      settings.useColors ? format.colorize({ all: true }) : format.uncolorize(),
      format.printf(({ timestamp, level, message, ...meta }) => {
        const rest = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : "";
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${rest}`;
      })
    );

// Arquivo: JSON (recomendado) ou texto, conforme config
const fileFormat = settings.format === "json"
  ? format.combine(...base, format.json())
  : format.combine(
      ...base,
      format.uncolorize(), // arquivo sem códigos de cor
      format.printf(({ timestamp, level, message, ...meta }) => {
        const rest = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : "";
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${rest}`;
      })
    );

const logTransports = [];
if (settings.output === "console" || settings.output === "both") {
  logTransports.push(new transports.Console({ format: consoleFormat }));
}
if (settings.output === "file" || settings.output === "both") {
  logTransports.push(
    new transports.File({
      filename: path.join(settings.logDir, settings.fileName),
      format: fileFormat,
    })
  );
}

const logger = createLogger({
  level: settings.level,
  // Colocamos um format padrão apenas para fallback.
  // O formato real é definido em cada transport (acima).
  format: format.combine(...base, format.json()),
  transports: logTransports,
});

module.exports = logger;
