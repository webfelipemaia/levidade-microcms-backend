const express = require('express');
const router = express.Router();

/**
 * GET /
 *
 * @route GET /
 * @summary Returns the application name from environment variables.
 * @tags App
 * @returns {Object} 200 - JSON object containing the app name.
 *
 * @example
 * // Response example
 * {
 *   "message": "MyAppName"
 * }
 */
router.get('/', app);

/**
 * Route handler for GET /
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 */
function app(req, res, next) {
    res.send({
        message: `${process.env.APP_NAME}`
    });
}

module.exports = router;