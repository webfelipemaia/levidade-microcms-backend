const express = require('express');
const privateRouterV1 = express.Router();
const authController = require('../../../controllers/auth.controller');

const authenticate = require('../../../middlewares/auth.middleware');

privateRouterV1.get('/me', authenticate, authController.getMe);

module.exports = privateRouterV1;