// config/logger.js
const fs = require("fs");
const path = require("path")

require('dotenv').config();
const { createLogger, format, transports } = require("winston");

const settings = {
  level: process.env.LOG_LEVEL || "info",
  toConsole: process.env.LOG_TO_CONSOLE === "true",
  toFile: process.env.LOG_TO_FILE === "true",
  formatType: process.env.LOG_FORMAT || "json",
  dateFormat: process.env.LOG_DATE_FORMAT || "YYYY-MM-DD HH:mm:ss",
  logFilePath:
    process.env.LOG_FILE_PATH || path.join(__dirname, "../logs/app.log"),
};

// Ensures the logs folder if saving to file
if (settings.toFile) {
  const logDir = path.dirname(settings.logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

// Base formatting (timestamp + stacktrace)
const base = [
  format.timestamp({ format: settings.dateFormat }),
  format.errors({ stack: true }),
];

// Format Builder
const buildFormat = (forConsole = true) => {
  if (settings.formatType === "json") {
    return format.combine(...base, format.json());
  }
  return format.combine(
    ...base,
    forConsole ? format.colorize({ all: true }) : format.uncolorize(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      const rest =
        meta && Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : "";
      return `[${timestamp}] [${level.toUpperCase()}] ${message}${rest}`;
    })
  );
};

// Transports
const logTransports = [];
if (settings.toConsole) {
  logTransports.push(new transports.Console({ format: buildFormat(true) }));
}
if (settings.toFile) {
  logTransports.push(
    new transports.File({
      filename: settings.logFilePath,
      format: buildFormat(false),
    })
  );
}

// fallback: always have at least 1 transport
if (logTransports.length === 0) {
  logTransports.push(new transports.Console({ format: buildFormat(true) }));
}

const logger = createLogger({
  level: settings.level,
  format: format.combine(...base, format.json()),
  transports: logTransports,
});

module.exports = logger;
