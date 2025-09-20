const express = require('express');
const publicRouterV1 = express.Router();
const authController = require('../../../controllers/auth.controller');

publicRouterV1.get('/app', app);
publicRouterV1.post('/login', authController.login);
publicRouterV1.post('/register', authController.register);
publicRouterV1.post('/logout', authController.logout);
publicRouterV1.post('/forgot-password', authController.forgotPassword);
publicRouterV1.post('/verify-recovery-code', authController.verifyRecoveryCode);
publicRouterV1.post('/reset-password-with-code', authController.resetPasswordWithCode);
publicRouterV1.post('/resend-recovery-code', authController.resendRecoveryCode);

function app(req, res, next) {
    res.send({
        message: `${process.env.APP_NAME}`
    });
}

module.exports = publicRouterV1;