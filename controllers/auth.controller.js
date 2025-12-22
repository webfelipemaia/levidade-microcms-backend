const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Role, File } = require("../models");
const logger = require("../config/logger");
const { sendPasswordRecoveryEmail } = require ("../services/email.service");
//const recentRequests = new Map();
const recoveryCodes = new Map();
const recentRequests = new Map(); 

/**
 * Authenticates a user using email and password, returning a JWT and user info.
 *
 * @route POST /auth/login
 * @param {import('express').Request} req - Express request object. Expects `email` and `password` in `req.body`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<Object>} JSON object containing authentication status, user data, and token information. 
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name']
        },
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'type']
        }
      ]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const roleNames = user.roles?.map((r) => r.name) || [];
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      roles: roleNames
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '1h'
    });

    const decoded = jwt.decode(token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // mude para true se usar HTTPS
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000 
    });

    return res.status(200).json({
      status: "success",
      message: "Authentication successful",
      token,
      data: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        roles: roleNames,
        avatar: user.avatar
      },
      tokenInfo: {
        issuedAt: new Date(decoded.iat * 1000),
        expiresAt: new Date(decoded.exp * 1000)
      }
    });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

/**
 * Registers a new user and automatically logs them in.
 *
 * @route POST /auth/register
 * @param {import('express').Request} req - Express request object. Expects `email` and `password` in `req.body`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<Object>} JSON object containing registration status and user data.
 *
 */
exports.register = async (req, res) => {
  try {
    const { email, password, name, lastname } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      name: name,
      lastname: lastname
    });

    await user.save();

    const newUser = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name']
        },
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'type'],
        }
      ],
      attributes: { exclude: ['password'] }
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        lastname: newUser.lastname,
        roles: newuser.roles?.map(r => r.name) || []
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    const decoded = jwt.decode(token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000 // 1h
    });

    res.status(201).json({
      message: "User registered and logged in successfully",
      token,
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        lastname: newUser.lastname,
        roles: newuser.roles?.map(r => r.name) || [],
        files: newuser.files?.map(file => ({
          id: file.id,
          name: file.name,
          path: file.path,
          type: file.type
        })) || []
      },
      tokenInfo: {
        issuedAt: new Date(decoded.iat * 1000),
        expiresAt: new Date(decoded.exp * 1000)
      }
    });

  } catch (err) {
    logger.error('Register Error:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.checkSession = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(200).json({ authenticated: false, message: 'Token not found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({
      authenticated: true,
      user: decoded,
      message: 'Valid session'
    });
  } catch (err) {
    return res.status(200).json({ authenticated: false, message: 'Invalid or expired token' });
  }
}

/**
 * Retrieves the current authenticated user's info based on the JWT cookie.
 *
 * @route GET /auth/me
 * @param {import('express').Request} req - Express request object. Expects JWT in cookies.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<Object>} JSON object containing user info and token info.
 *
 */
exports.getMe = async (req, res) => {
  try {
    const token = 
      req.cookies?.token || 
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: 'Token not supplied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name'],
          //through: { attributes: [] }
        },
        {
          model: File,
          as: 'avatar', // Alias definido no index.js
          attributes: ['id', 'name', 'path', 'type']
        }
      ],
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        roles: user.roles?.map(r => r.name) || [],
        avatar: user.avatar ? {
          id: user.avatar.id,
          name: user.avatar.name,
          path: user.avatar.path,
          type: user.avatar.type
        } : null,
        userFiles: user.userFiles?.map(file => ({
          id: file.id,
          name: file.name,
          path: file.path,
          type: file.type
        })) || []
      },
      token,
      tokenInfo: {
        issuedAt: new Date(decoded.iat * 1000),
        expiresAt: new Date(decoded.exp * 1000)
      }
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: 'Invalid token',
        details: error.message
      });
    }

    logger.error('getMe Error:', error);
    res.status(500).json({ 
      status: "failure",
      message: 'Internal server error.' 
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax'
    });
    
    res.status(200).json({ 
      status: "success",
      message: "Logout successful" 
    });
  } catch (err) {
    logger.error('Logout error:', err);
    res.status(500).json({ 
      status: "failure",
      message: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const now = Date.now();
    const lastRequest = recentRequests.get(email);
    
    if (lastRequest && (now - lastRequest) < 60000) {
      return res.status(429).json({
        success: false,
        message: 'Please wait a minute before requesting again.'
      });
    }
    
    recentRequests.set(email, now);

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.json({
        success: true,
        message: 'If the email exists in our database, we will send you a recovery code.'
      });
    }

    // Generate 6-digit code
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = now + 900000; // 15 minutes

    // Cache code
    recoveryCodes.set(email, {
      code: recoveryCode,
      expires: codeExpiry,
      userId: user.id
    });

    setTimeout(() => {
      recoveryCodes.delete(email);
    }, 900000);

    try {
      await sendPasswordRecoveryEmail(email, recoveryCode);
      
      res.json({
        success: true,
        message: 'If the email exists in our database, we will send you a recovery code.'
      });

    } catch (emailError) {
      logger.error('Error sending email:', emailError);
      recoveryCodes.delete(email);
      
      res.status(500).json({
        success: false,
        message: 'Error sending recovery email'
      });
    }

  } catch (error) {
    logger.error('ForgotPassword error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.verifyRecoveryCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const storedData = recoveryCodes.get(email);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired code'
      });
    }

    if (Date.now() > storedData.expires) {
      recoveryCodes.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Expired code'
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect code'
      });
    }

    const resetToken = await bcrypt.hash(`${email}${Date.now()}`, 10);
    
    // Store token valid for 10 minutes
    recoveryCodes.set(email, {
      ...storedData,
      resetToken: resetToken,
      resetTokenExpires: Date.now() + 600000
    });

    res.json({
      success: true,
      message: 'Code verified successfully',
      resetToken: resetToken
    });

  } catch (error) {
    logger.error('Error verifying code:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reset password with valid token
exports.resetPasswordWithCode = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const storedData = recoveryCodes.get(email);
    
    if (!storedData || !storedData.resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired session'
      });
    }

    if (Date.now() > storedData.resetTokenExpires) {
      recoveryCodes.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Expired session'
      });
    }

    if (storedData.resetToken !== resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const user = await User.findByPk(storedData.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    recoveryCodes.delete(email);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    logger.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};

exports.resendRecoveryCode = async (req, res) => {
  try {
    const { email } = req.body;
    const now = Date.now();
    const lastRequest = recentRequests.get(email);
    
    if (lastRequest && (now - lastRequest) < 30000) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 30 seconds before requesting a new code.'
      });
    }

    recentRequests.set(email, now);
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.json({
        success: true,
        message: 'If the email exists, we will send you a new code.'
      });
    }

    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = now + 900000; // 15 minutes

    // Cache code
    recoveryCodes.set(email, {
      code: recoveryCode,
      expires: codeExpiry,
      userId: user.id
    });

    await sendPasswordRecoveryEmail(email, recoveryCode);

    res.json({
      success: true,
      message: 'New code sent successfully'
    });

  } catch (error) {
    logger.error('Error resending code:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending code'
    });
  }
};
