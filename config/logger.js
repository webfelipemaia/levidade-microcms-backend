// config/logger.js
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

// Settings
const settings = {
  level: process.env.LOG_LEVEL || "info",
  toConsole: process.env.LOG_TO_CONSOLE === "true",
  toFile: process.env.LOG_TO_FILE === "true",
  formatType: process.env.LOG_FORMAT || "json",
  dateFormat: process.env.LOG_DATE_FORMAT || "YYYY-MM-DD HH:mm:ss",
  logFilePath: process.env.LOG_FILE_PATH || path.join(__dirname, "../logs/app.log"),
  rotateDays: process.env.LOG_ROTATE_DAYS || "1d",
  maxFiles: process.env.LOG_MAX_FILES || "14d",
  maxSize: process.env.LOG_MAX_SIZE || "20m",
};

// Ensure log folder
if (settings.toFile) {
  const logDir = path.dirname(settings.logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

// Base formatting
const base = [
  format.timestamp({ format: settings.dateFormat }),
  format.errors({ stack: true }),
];

// Format builder
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

// Console logs
if (settings.toConsole) {
  logTransports.push(new transports.Console({ format: buildFormat(true) }));
}

// Rotating File logs
if (settings.toFile) {
  const logDir = path.dirname(settings.logFilePath);
  const baseName = path.basename(settings.logFilePath, ".log");

  const rotateTransport = new transports.DailyRotateFile({
    filename: path.join(logDir, `${baseName}-%DATE%.log`),
    datePattern: settings.dateFormat,
    zippedArchive: false,
    maxSize: settings.maxSize,
    maxFiles: settings.maxFiles,
    level: settings.level,
    format: buildFormat(false),
  });

  logTransports.push(rotateTransport);
}

// Fallback — at least one transport
if (logTransports.length === 0) {
  logTransports.push(new transports.Console({ format: buildFormat(true) }));
}

// Create logger
const logger = createLogger({
  level: settings.level,
  transports: logTransports,
});

module.exports = logger;
