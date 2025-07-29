const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const userService = require('../services/user.service');


exports.authenticate = (req, res, next) => {
    const { email, password } = req.body;
    userService.authenticate(email, password)
      .then(user => res.json(user))
      .catch(next);
};

exports.register = (req, res, next) => {
    userService.create(req.body)
      .then(() => res.json({ status: 'success', message: 'User registered successfully' }))
      .catch(next);
};

exports.getAll = (req, res, next) => {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
};

exports.getUsersRoles = (req, res, next) => {
    userService.getUsersRoles()
        .then(users => res.json(users))
        .catch(next);
};

exports.getById = (req, res, next) => {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
};

exports.create = (req, res, next) => {
    userService.create(req.body)
        .then(user => res.json(user))
        .catch(next);
};

exports.update = (req, res, next) => {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ status: 'success',  message: 'User updated' }))
        .catch(next);
};

exports._delete = (req, res, next) => {
    userService.delete(req.params.id)
        .then(() => res.json({ status: 'success',  message: 'User deleted' }))
        .catch(next);
};

// schema functions

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

exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().empty(''),
        name: Joi.string().empty(''),
        lastname: Joi.string().empty(''),
        roles: Joi.array().empty('')
    });
    validateRequest(req, next, schema);
};

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