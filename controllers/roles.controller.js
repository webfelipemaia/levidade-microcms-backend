const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const roleService = require('../services/role.service');    

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
    validateRequest(req, next, schema);
};

/**
 * Schema for updating a role and its permissions.
 */
exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        permissions: Joi.array().empty('')
    });
    validateRequest(req, next, schema);
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
    validateRequest(req, next, schema);
};