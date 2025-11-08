const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const roleService = require('../services/role.service');
const { pagination } = require("../services/setting.service");
const logger = require("../config/logger");

/**
 * Get all roles.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
exports.getAll = (req, res, next) => {
    roleService.getAll()
        .then(roles => res.json(roles))
        .catch(next);
};

/**
 * Fetches paginated roles with optional search and order parameters.
 *
 * @route GET /roles/paginated
 * @param {number} [req.query.page] - Page number (default 1).
 * @param {number} [req.query.pageSize] - Number of items per page.
 * @param {string} [req.query.search] - Search query string.
 * @param {string} [req.query.order] - JSON string array for sorting order.
 * @returns {Promise<Object>} JSON object containing paginated roles.
 */
exports.getAllPaginated = async (req, res, next) => {
    try {
        const paginationSettings = await pagination();
        const storedPageOrder = paginationSettings.order;
        const storedPageSize = parseInt(paginationSettings.pageSize);

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const pageSize = Math.max(parseInt(req.query.pageSize) || storedPageSize, 1);

        const searchQuery = req.query.search || '';
        const order = req.query.order ? JSON.parse(req.query.order) : [storedPageOrder];

        const result = await roleService.getPaginatedRoles(
            page, 
            pageSize, 
            searchQuery, 
            order
        );

        return res.status(200).json(result);
    } catch (error) {
        logger.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
};

/**
 * Get all roles with associated permissions (selected attributes).
 */
exports.getRolesPermissions = (req, res, next) => {
    roleService.getRolesPermissions()
        .then(roles => res.json(roles))
        .catch(next);
};

/**
 * Get all roles with all associated permissions.
 */
exports.getAllRolesPermissions = (req, res, next) => {
    roleService.getAllRolesPermissions()
        .then(roles => res.json(roles))
        .catch(next);
};

/**
 * Get a role by ID.
 * @param {string|number} req.params.id - Role ID.
 */
exports.getById = (req, res, next) => {
    roleService.getById(req.params.id)
        .then(role => res.json(role))
        .catch(next);
};

/**
 * Create a new role.
 * @param {Object} req.body - Role data.
 */
exports.create = (req, res, next) => {
    roleService.create(req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Role registered successfully' 
            }
        ))
        .catch(next);
};

/**
 * Update an existing role and its permissions.
 * @param {string|number} req.params.id - Role ID.
 * @param {Object} req.body - Updated role data including permissions.
 */
exports.update = (req, res, next) => {
    roleService.update(req.params.id, req.body)
        .then(() => res.json(
            { 
                status: 'success', 
                message: 'Role updated' 
            }
        ))
        .catch(next);
};

/**
 * Delete a role by ID.
 * @param {string|number} req.params.id - Role ID.
 */
exports._delete = (req, res, next) => {
    roleService.delete(req.params.id)
        .then(() => res.json(
            { 
                status: 'success',  
                message: 'Role deleted' 
            }
        ))
        .catch(next);
};

/**
 * Create a role and assign permissions at the same time.
 * @param {Object} req.body - Role data including permission names.
 */
exports.createRoleWithPermissions = (req, res, next) => {
    roleService.createRoleWithPermissions(req.body)
        .then(role => res.json(role))
        .catch(next);
};

/**
 * Schema for creating a role.
 */
exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
};

/**
 * Schema for updating a role and its permissions.
 */
exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        permissions: Joi.array().empty('')
    });
    validateRequest(req, res, next, schema);
};


/**
 * Update permissions for a specific role
 * @param {string|number} req.params.id - Role ID
 * @param {Object} req.body - Permissions data { permissions: [1, 2, 3] }
 */
exports.updateRolePermissions = async (req, res, next) => {
    try {
        const roleId = parseInt(req.params.id);
        const { permissions } = req.body;

        if (!roleId || isNaN(roleId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Valid Role ID is required'
            });
        }

        const result = await roleService.updateRolePermissions(roleId, permissions || []);
        res.json(result);
        
    } catch (error) {
        console.error('Error in updateRolePermissions:', error);
        next(error);
    }
};

/**
 * Get permissions for a specific role
 * @param {string|number} req.params.id - Role ID
 */
exports.getRolePermissions = async (req, res, next) => {
    try {
        const roleId = parseInt(req.params.id);
        
        if (!roleId || isNaN(roleId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Valid Role ID is required'
            });
        }

        const permissions = await roleService.getRolePermissions(roleId);
        res.json({ 
            status: 'success', 
            data: permissions 
        });
        
    } catch (error) {
        console.error('Error in getRolePermissions:', error);
        next(error);
    }
};

/**
 * Schema for updating role permissions
 */
exports.updatePermissionsSchema = (req, res, next) => {
    const schema = Joi.object({
        permissions: Joi.array().items(Joi.number().integer().min(1)).optional()
    });
    validateRequest(req, res, next, schema);
};