const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const permissionService = require('../services/permission.service');
const rolesPermissionsService = require('../services/rolesPermissions.service');


/**
 * Fetch all permissions.
 *
 * @route GET /permissions
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object[]>} JSON array of permissions
 */
exports.getAll = (req, res, next) => {
    permissionService.getAll()
        .then(permissions => res.json(permissions))
        .catch(next);
};

/**
 * Fetch permissions assigned to roles.
 *
 * @route GET /permissions/roles
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object[]>} JSON array of permissions with roles
 */
exports.getPermissionsRoles = (req, res, next) => {
    rolesPermissionsService.getAll()
        .then(permissions => res.json(permissions))
        .catch(next);
};

/**
 * Fetch all roles with their assigned permissions.
 *
 * @route GET /permissions/all-roles
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object[]>} JSON array of roles and permissions
 */
exports.getAllPermissionsRoles = (req, res, next) => {
    permissionService.getAllPermissionsRoles()
        .then(permissions => res.json(permissions))
        .catch(next);
};

/**
 * Fetch a single permission by ID.
 *
 * @route GET /permissions/:id
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object of the requested permission
 */
exports.getById = (req, res, next) => {
    permissionService.getById(req.params.id)
        .then(permission => res.json(permission))
        .catch(next);
};

/**
 * Create a new permission.
 *
 * @route POST /permissions
 * @param {import('express').Request} req - Expects { name } in req.body
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON status message
 */
exports.create = (req, res, next) => {
    permissionService.create(req.body)
        .then(() => res.json({ status: 'success', message: 'Permission created' }))
        .catch(next);
};

/**
 * Update an existing permission by ID.
 *
 * @route PUT /permissions/:id
 * @param {import('express').Request} req - Expects updated data in req.body
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON status message
 */
exports.update = (req, res, next) => {
    permissionService.update(req.params.id, req.body)
        .then(() => res.json({ status: 'success', message: 'Permission updated' }))
        .catch(next);
};

/**
 * Delete a permission by ID.
 *
 * @route DELETE /permissions/:id
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON status message
 */
exports._delete = (req, res, next) => {
    permissionService.delete(req.params.id)
        .then(() => res.json({ status: 'success', message: 'Permission deleted' }))
        .catch(next);
};

/**
 * Assign a permission to a role.
 *
 * @route POST /permissions/assign
 * @param {import('express').Request} req - Expects { roleName, permissionName } in req.body
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON status message and updated role object
 */
exports.addPermissionsToRole = (req, res, next) => {
    const { roleName, permissionName } = req.body;
    permissionService.addPermissionToRole(roleName, permissionName)
        .then(role => res.json({status: 'success', message: 'Permission added successfully', role }))
        .catch(next);
};

/**
 * Validation schema for creating a permission.
 */
exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
};

/**
 * Validation schema for updating a permission.
 */
exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().empty('')
    });
    validateRequest(req, res, next, schema);
};