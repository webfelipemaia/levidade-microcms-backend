const util = require("util");
const multer = require("multer");
const fs = require("fs");
const { fromBuffer } = require("file-type");
const path = require("path");
const crypto = require("crypto");
const settingsHelper = require("../helpers/settings2.helper");
const {
  UPLOAD_CONTENT_TYPE,
  ALLOWED_MIME_TYPES,
} = require("../helpers/constants.helper");
const logger = require("../config/logger");

/**
 * Ensures that a directory exists; creates it recursively if it does not.
 *
 * @param {string} dirPath - The path of the directory to check or create.
 */
function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.info(`Directory created: ${dirPath}`);
  }
}

/**
 * Validates the contentType and returns the corresponding subdirectory for upload.
 *
 * @async
 * @param {string} contentType - The type of content to upload.
 * @returns {Promise<string>} The subdirectory name corresponding to the contentType.
 * @throws Will throw an error if contentType is missing, invalid, or not configured.
 */
async function getUploadPath(contentType) {
  const settings = await settingsHelper.loadSettings();

  if (!contentType || !Object.values(UPLOAD_CONTENT_TYPE).includes(contentType)) {
    throw new Error("Invalid, missing, or disallowed content type");
  }

  if (!settings.uploadContentType) {
    throw new Error("Upload Content Type configuration not found in the database.");
  }

  const contentTypePaths = settings.uploadContentType;
  let matchedContentType;

  if (Array.isArray(contentTypePaths)) {
    matchedContentType = contentTypePaths.find(
      (item) => item.value === contentType
    );
  } else if (typeof contentTypePaths === "object") {
    matchedContentType = Object.values(contentTypePaths).find(
      (item) => item.value === contentType
    );
  } else {
    throw new Error("uploadContentType must be an array or object.");
  }

  if (matchedContentType) return matchedContentType.value;

  throw new Error("Invalid or missing contentType.");
}

/**
 * Multer storage configuration to handle file uploads.
 * Generates unique filenames and organizes uploads by contentType and date.
 */
const storage = multer.diskStorage({
  /**
   * Determines the upload directory based on contentType and current date.
   *
   * @param {import('express').Request} req - Express request object.
   * @param {Express.Multer.File} file - The uploaded file object.
   * @param {Function} cb - Callback to set the destination directory.
   */
  destination: async (req, file, cb) => {
    try {
      const contentType = `${req.body?.contentType || ""}`.trim().toLowerCase();
      const settings = await settingsHelper.loadSettings();
      const basePath = settings.uploadPathContent[0]?.value;

      if (!basePath || typeof basePath !== "string") {
        throw new Error("Invalid upload path in settings");
      }

      const subfolder = await getUploadPath(contentType);

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");

      const uploadPath = path.join(__basedir, basePath, subfolder, `${year}_${month}`);
      await fs.promises.mkdir(uploadPath, { recursive: true });

      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },

  /**
   * Generates a unique filename for the uploaded file.
   *
   * @param {import('express').Request} req - Express request object.
   * @param {Express.Multer.File} file - The uploaded file object.
   * @param {Function} cb - Callback to set the filename.
   */
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = crypto.randomBytes(16).toString("hex") + ext;

    logger.info(`Upload file: Original = ${file.originalname}, Extension = ${ext}, Generated = ${uniqueName}`);
    cb(null, uniqueName);
  },
});

/**
 * Middleware to handle file uploads with validation and limits.
 * Validates MIME type and file size according to settings.
 */
const uploadFile = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error("File type not allowed"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: async () => {
      const settings = await settingsHelper.loadSettings();
      const maxFileSize = settings.uploadMaxFileSize.value;
      return parseInt(settings.filesize[maxFileSize].value);
    },
  },
}).fields([
  {
    name: "file",
    maxCount: async () => {
      const settings = await settingsHelper.loadSettings();
      return parseInt(settings.uploadLimit.value);
    },
  },
]);

/**
 * Promisified version of the upload middleware for async/await usage.
 *
 * @type {Function}
 */
const uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
