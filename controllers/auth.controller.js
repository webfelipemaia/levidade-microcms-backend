const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../helpers/db.helper");
const logger = require("../config/logger");


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
    const user = await db.User.findOne({
      where: { email },
      include: db.Role
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      role: user.Roles?.map((r) => r.name)
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '1h'
    });

    const decoded = jwt.decode(token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000 
    });

    return res.status(200).json({
      status: "success",
      message: "Authentication successful",
      data: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        roles: user.Roles?.map(r => r.name)
      },
      tokenInfo: {
        issuedAt: new Date(decoded.iat * 1000),
        expiresAt: new Date(decoded.exp * 1000)
      }
    });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
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
    const { email, password } = req.body;

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new db.User({
      email,
      password: hashedPassword,
    });

    await user.save();

    // Gera token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        role: []
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000 // 1h
    });

    res.status(201).json({
      message: "User registered and logged in successfully",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname
      }
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

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
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ message: 'Token not supplied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.User.findByPk(decoded.id, {
      include: db.Role,
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        roles: user.Roles?.map(r => r.name)
      },
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
    res.status(500).json({ message: 'Internal server error.' });
  }
};

