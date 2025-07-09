const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

const authenticate = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authenticate, authController.getMe);

module.exports = router;