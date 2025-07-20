const express = require('express');
const publicRouterV1 = express.Router();
const authController = require('../../../controllers/auth.controller');

publicRouterV1.get('/app', app);
publicRouterV1.post('/login', authController.login);
publicRouterV1.post('/register', authController.register);

function app(req, res, next) {
    res.send({
        message: `${process.env.APP_NAME}`
    });
}

module.exports = publicRouterV1;