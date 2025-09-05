// middlewares/validateFile.js
const fs = require('fs');
const { fileTypeFromFile } = require('file-type');
const logger = require("../config/logger");

/**
 * Middleware to validate uploaded files by checking their actual MIME type.
 *
 * @async
 * @function validateFile
 * @param {import('express').Request} req - The Express request object, expected to contain `req.files.file`.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<import('express').Response|void>} Sends a JSON error response if validation fails, or calls `next()` if the file is valid.
 *
 * @description
 * - Ensures that a file is present in the request (`req.files.file[0]`).
 * - Uses `fileTypeFromFile` to detect the actual MIME type of the file.
 * - Compares the detected MIME type with the declared one (`file.mimetype`).
 * - Returns:
 *   - `400 Bad Request` if no file is found, type cannot be determined, or MIME types mismatch.
 *   - `500 Internal Server Error` if any unexpected error occurs.
 * - Calls `next()` if the file passes all validations.
 *
 * @example
 * // Example usage in an Express route with multer
 * const express = require('express');
 * const multer = require('multer');
 * const upload = multer({ dest: 'uploads/' });
 *
 * app.post('/upload', upload.fields([{ name: 'file', maxCount: 1 }]), validateFile, (req, res) => {
 *   res.json({ message: 'File uploaded and validated successfully.' });
 * });
 */
const validateFile = async (req, res, next) => {
  try {
    
    const file = req.files?.file?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No file found for validation.' });
    }

    const filePath = file.path;
    const fileType = await fileTypeFromFile(filePath);

    if (!fileType) {
      return res.status(400).json({ message: 'Unable to determine file type.' });
    }

    if (fileType.mime !== file.mimetype) {
      return res.status(400).json({
        message: `File type mismatch. Detected: ${fileType.mime}, Declared: ${file.mimetype}`,
      });
    }

    next();
  } catch (error) {
    logger.error('File validation error:', error);
    return res.status(500).json({ message: 'Error validating file type.' });
  }
};

module.exports = validateFile;
