module.exports = errorHandler;

/**
 * Global error handling middleware for Express applications.
 *
 * @function errorHandler
 * @param {Error|string} err - The error object or a string message representing the error.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {import('express').Response} A JSON response with the error message and appropriate status code.
 *
 * @description
 * - If the error is a `string`, it is treated as a custom application error:
 *   - Returns `404 Not Found` if the message ends with `"not found"`.
 *   - Returns `400 Bad Request` otherwise.
 * - If the error is an `Error` object, it defaults to `500 Internal Server Error`.
 *
 * @example
 * // Register the error handler as the last middleware
 * const express = require('express');
 * const app = express();
 *
 * app.use('/api', apiRoutes);
 *
 * // Error handler must be the last middleware
 * app.use(errorHandler);
 */
function errorHandler(err, req, res, next) {
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        default:
            return res.status(500).json({ message: err.message });
    }
}