const util = require("util");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const { FILESIZES, UPLOAD_PATH, UPLOAD_CONTENT_TYPE } = require('../helpers/constants.helper');

const maxSize = FILESIZES["2 MB"];
const uploadLimit = 3;
const articleDir = UPLOAD_CONTENT_TYPE.ARTICLE;
const pageDir = UPLOAD_CONTENT_TYPE.PAGE;
const productDir = UPLOAD_CONTENT_TYPE.PRODUCT;

/**
 * Ensures that a directory exists; if it does not, creates it.
 *
 * @param {string} dirPath - The path of the directory to check or create.
 */
function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: false });
    req.appLogger.info(`Directory created: ${dirPath}`);
  }
}

/**
 * Multer storage configuration for handling file uploads.
 */
let storage = multer.diskStorage({
  /**
   * Determines the destination folder for the uploaded file based on request body IDs.
   *
   * @param {import('express').Request} req - The Express request object.
   * @param {Express.Multer.File} file - The uploaded file object.
   * @param {Function} cb - The callback function to specify destination folder.
   */
  destination: (req, file, cb) => {
    let uploadPath = __basedir + UPLOAD_PATH.CONTENT;

    if (req.body.articleId) {
      const articleId = req.body.articleId;
      uploadPath = path.join(__basedir + UPLOAD_PATH.CONTENT + articleDir, articleId);
      ensureDirectoryExistence(uploadPath);

    } else if (req.body.pageId) {
      const pageId = req.body.pageId;
      uploadPath = path.join(__basedir + UPLOAD_PATH.CONTENT + pageDir, pageId);
      ensureDirectoryExistence(uploadPath);

    } else if (req.body.productId) {
      const productId = req.body.productId;
      uploadPath = path.join(__basedir + UPLOAD_PATH.CONTENT + productDir, productId);
      ensureDirectoryExistence(uploadPath);

    } else {
      req.appLogger.info('Upload file to default content folder.');
    }

    cb(null, uploadPath);
  },

  /**
   * Generates a unique filename for each uploaded file.
   *
   * @param {import('express').Request} req - The Express request object.
   * @param {Express.Multer.File} file - The uploaded file object.
   * @param {Function} cb - The callback function to specify the filename.
   */
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = crypto.randomBytes(16).toString('hex') + ext;
    req.appLogger.info("Original file name: " + file.originalname, "extension file: " + ext, "Generated file name: " + uniqueName);
    cb(null, uniqueName);
  },
});

/**
 * Middleware to handle multiple file uploads with Multer.
 * Limits the file size and the number of files.
 */
let multipleUploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).fields([
  { name: "files", maxCount: uploadLimit },
]);

/**
 * Promisified version of the multiple file upload middleware for easier async/await usage.
 * 
 * @type {Function}
 */
let multipleUploadFileMiddleware = util.promisify(multipleUploadFile);

module.exports = multipleUploadFileMiddleware;
