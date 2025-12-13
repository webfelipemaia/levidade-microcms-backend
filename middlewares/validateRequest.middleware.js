module.exports = validateRequest;

/**
 * Validates the request body against a given Joi schema.
 *
 * @function validateRequest
 * @param {import('express').Request} req - The Express request object containing the body to validate.
 * @param {import('express').NextFunction} next - The Express next function to pass control or errors.
 * @param {import('joi').Schema} schema - The Joi schema to validate the request body against.
 *
 * @description
 * - Validates `req.body` using the provided Joi schema.
 * - Options used:
 *   - `abortEarly: false` → collect all validation errors instead of stopping at the first.
 *   - `allowUnknown: true` → ignore unknown properties not defined in the schema.
 *   - `stripUnknown: true` → remove unknown properties from `req.body`.
 * - If validation fails, calls `next()` with a formatted error message including all validation errors.
 * - If validation succeeds, updates `req.body` with the validated and sanitized value and calls `next()` without arguments.
 *
 * @example
 * const Joi = require('joi');
 * const schema = Joi.object({
 *   name: Joi.string().required(),
 *   age: Joi.number().integer().min(0)
 * });
 *
 * app.post('/user', (req, res, next) => {
 *   validateRequest(req, next, schema);
 * }, (req, res) => {
 *   res.send('Validation passed!');
 * });
 */

    function validateRequest(req, res, next, schema) {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        });
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(422).json({
                status: "error",
                message: errorMessage
            });
        }
    
        req.body = value;
        next();
    }