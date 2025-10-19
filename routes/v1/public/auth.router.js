const express = require('express');
const publicRouterV1 = express.Router();
const authController = require('../../../controllers/auth.controller');

publicRouterV1.get('/', (req, res) => {
    res.redirect('/api/v1/public/auth/app/');
});

publicRouterV1.get('/session-check', authController.checkSession);
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
        application: `${process.env.APP_NAME}`,
        env: `${process.env.NODE_ENV}`,
        port: `${process.env.SERVER_PORT}`,
        description: `${process.env.APP_DESCRIPTION}`,
    });
}


module.exports = publicRouterV1;