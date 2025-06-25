const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const userService = require('../services/user.service');
const auth = require('../middleware/auth');

// routes

router.get('/', getAll);
router.get('/roles', getUsersRoles);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
router.post('/authenticate', authenticate);
router.post('/register', registerSchema, register);

module.exports = router;

// route functions


function authenticate(req, res, next) {
    const { email, password } = req.body;
    userService.authenticate(email, password)
      .then(user => res.json(user))
      .catch(next);
  }

function register(req, res, next) {
    userService.create(req.body)
      .then(() => res.json({ status: 'success', message: 'User registered successfully' }))
      .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getUsersRoles(req, res, next) {
    userService.getUsersRoles()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ status: 'success',  message: 'User updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ status: 'success',  message: 'User deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        name: Joi.string().required(),
        lastname: Joi.string().required(),
        role: Joi.string()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().empty(''),
        name: Joi.string().empty(''),
        lastname: Joi.string().empty(''),
        roles: Joi.array().empty('')
    });
    validateRequest(req, next, schema);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      name: Joi.string().required(),
      lastname: Joi.string().required(),
    });
    validateRequest(req, next, schema);
  }