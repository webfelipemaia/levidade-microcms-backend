const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const userService = require('../services/user.service');


/**
 * Authenticate a user with email and password.
 *
 * @route POST /users/authenticate
 * @param {import('express').Request} req - Body must include `{ email: string, password: string }`.
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object containing user data and possibly a token
 */
exports.authenticate = (req, res, next) => {
    const { email, password } = req.body;
    userService.authenticate(email, password)
      .then(user => res.json(user))
      .catch(next);
};

/**
 * Register a new user.
 *
 * @route POST /users/register
 * @param {import('express').Request} req - Body must include `{ email, password, confirmPassword, name, lastname, role? }`.
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON confirmation with success message
 */
exports.register = (req, res, next) => {
    userService.create(req.body)
      .then(() => res.json({ status: 'success', message: 'User registered successfully' }))
      .catch(next);
};

/**
 * Retrieve all users.
 *
 * @route GET /users
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object[]>} JSON array of all users
 */
exports.getAll = (req, res, next) => {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
};

/**
 * Retrieve all users with their associated roles.
 *
 * @route GET /users/roles
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object[]>} JSON array of users with role information
 */
exports.getUsersRoles = (req, res, next) => {
    userService.getUsersRoles()
        .then(users => res.json(users))
        .catch(next);
};

/**
 * Retrieve a user by ID.
 *
 * @route GET /users/:id
 * @param {import('express').Request} req - Express request object with `id` parameter.
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object of the requested user
 */
exports.getById = (req, res, next) => {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
};

/**
 * Create a new user.
 *
 * @route POST /users
 * @param {import('express').Request} req - Body must include `{ email, password, name, lastname, role? }`.
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object of the created user
 */
exports.create = (req, res, next) => {
    userService.create(req.body)
        .then(user => res.json(user))
        .catch(next);
};

/**
 * Update an existing user by ID.
 *
 * @route PUT /users/:id
 * @param {import('express').Request} req - Body can include `{ email?, name?, lastname?, roles? }`.
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON confirmation with success message
 */
exports.update = (req, res, next) => {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ status: 'success',  message: 'User updated' }))
        .catch(next);
};

/**
 * Delete a user by ID.
 *
 * @route DELETE /users/:id
 * @param {import('express').Request} req - Express request object with `id` parameter.
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON confirmation with success message
 */
exports._delete = (req, res, next) => {
    userService.delete(req.params.id)
        .then(() => res.json({ status: 'success',  message: 'User deleted' }))
        .catch(next);
};

/**
 * Validation schema for creating a user.
 *
 * Requires `email`, `password`, `confirmPassword`, `name`, `lastname`, and optionally `role`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        name: Joi.string().required(),
        lastname: Joi.string().required(),
        role: Joi.string()
    });
    validateRequest(req, next, schema);
};

/**
 * Validation schema for updating a user.
 *
 * Allows optional updates for `email`, `name`, `lastname`, and `roles`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().empty(''),
        name: Joi.string().empty(''),
        lastname: Joi.string().empty(''),
        roles: Joi.array().empty('')
    });
    validateRequest(req, next, schema);
};

/**
 * Validation schema for user registration.
 *
 * Requires `email`, `password`, `confirmPassword`, `name`, and `lastname`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.registerSchema = (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      name: Joi.string().required(),
      lastname: Joi.string().required(),
    });
    validateRequest(req, next, schema);
};