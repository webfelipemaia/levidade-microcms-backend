const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../helpers/db.helper");
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
    const user = await db.User.findOne({
      where: { email },
      include: [
        {
          model: db.Role,
          attributes: ['id', 'name']
        },
        {
          model: db.File,
          attributes: ['id', 'name', 'path', 'type'],
          through: { attributes: [] } // Não retorna dados da tabela de junção
        }
      ]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      roles: user.Roles?.map((r) => r.name)
      // Não inclua files no payload do JWT para não deixar o token muito grande
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '1h'
    });

    const decoded = jwt.decode(token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
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
        roles: user.Roles?.map(r => r.name),
        files: user.Files?.map(file => ({
          id: file.id,
          name: file.name,
          path: file.path,
          type: file.type
        }))
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
    const { email, password, name, lastname } = req.body;

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new db.User({
      email,
      password: hashedPassword,
      name: name,
      lastname: lastname
    });

    await user.save();

    // Buscar o usuário recém-criado com os relacionamentos para retornar dados completos
    const newUser = await db.User.findByPk(user.id, {
      include: [
        {
          model: db.Role,
          attributes: ['id', 'name']
        },
        {
          model: db.File,
          attributes: ['id', 'name', 'path', 'type'],
          through: { attributes: [] }
        }
      ],
      attributes: { exclude: ['password'] }
    });

    // Gera token JWT
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        lastname: newUser.lastname,
        roles: newUser.Roles?.map(r => r.name) || []
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
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        lastname: newUser.lastname,
        roles: newUser.Roles?.map(r => r.name) || [],
        files: newUser.Files?.map(file => ({
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
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false, message: 'Token não encontrado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({
      authenticated: true,
      user: decoded,
      message: 'Sessão válida'
    });
  } catch (err) {
    return res.status(401).json({ authenticated: false, message: 'Token inválido ou expirado' });
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
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ message: 'Token not supplied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.User.findByPk(decoded.id, {
      include: [
        {
          model: db.Role,
          attributes: ['id', 'name']
        },
        {
          model: db.File,
          attributes: ['id', 'name', 'path', 'type'],
          through: { attributes: [] }
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
        roles: user.Roles?.map(r => r.name),
        files: user.Files?.map(file => ({
          id: file.id,
          name: file.name,
          path: file.path,
          type: file.type
        }))
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

    // Validar email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça um email válido'
      });
    }

    // Prevenir spam: limitar solicitações para o mesmo email
    const now = Date.now();
    const lastRequest = recentRequests.get(email);
    
    if (lastRequest && (now - lastRequest) < 60000) {
      return res.status(429).json({
        success: false,
        message: 'Aguarde um minuto antes de solicitar novamente'
      });
    }
    
    recentRequests.set(email, now);

    // Verificar se o usuário existe
    const user = await db.User.findOne({ where: { email } });
    
    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      return res.json({
        success: true,
        message: 'Se o email existir em nossa base, enviaremos um código de recuperação'
      });
    }

    // Gerar código de 6 dígitos
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = now + 900000; // 15 minutos

    // Armazenar código em cache (em produção, use Redis)
    recoveryCodes.set(email, {
      code: recoveryCode,
      expires: codeExpiry,
      userId: user.id
    });

    // Limpar código após expiração
    setTimeout(() => {
      recoveryCodes.delete(email);
    }, 900000);

    // Enviar email com o código
    try {
      await sendPasswordRecoveryEmail(email, recoveryCode);
      
      res.json({
        success: true,
        message: 'Se o email existir em nossa base, enviaremos um código de recuperação'
      });

    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      recoveryCodes.delete(email); // Remover código se email falhar
      
      res.status(500).json({
        success: false,
        message: 'Erro ao enviar email de recuperação'
      });
    }

  } catch (error) {
    console.error('Erro no forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Novo endpoint para verificar código
exports.verifyRecoveryCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const storedData = recoveryCodes.get(email);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'Código inválido ou expirado'
      });
    }

    if (Date.now() > storedData.expires) {
      recoveryCodes.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Código expirado'
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        success: false,
        message: 'Código incorreto'
      });
    }

    // Código válido - gerar token de sessão para reset
    const resetToken = await bcrypt.hash(`${email}${Date.now()}`, 10);
    
    // Armazenar token válido por 10 minutos
    recoveryCodes.set(email, {
      ...storedData,
      resetToken: resetToken,
      resetTokenExpires: Date.now() + 600000
    });

    res.json({
      success: true,
      message: 'Código verificado com sucesso',
      resetToken: resetToken
    });

  } catch (error) {
    console.error('Erro na verificação do código:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Endpoint para resetar senha com token válido
exports.resetPasswordWithCode = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const storedData = recoveryCodes.get(email);
    
    if (!storedData || !storedData.resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Sessão inválida ou expirada'
      });
    }

    if (Date.now() > storedData.resetTokenExpires) {
      recoveryCodes.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Sessão expirada'
      });
    }

    if (storedData.resetToken !== resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Buscar usuário e atualizar senha
    const user = await db.User.findByPk(storedData.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    // Limpar dados de recuperação
    recoveryCodes.delete(email);

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });

  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao redefinir senha'
    });
  }
};

// Adicione este método no seu auth.controller.js
exports.resendRecoveryCode = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar rate limiting
    const now = Date.now();
    const lastRequest = recentRequests.get(email);
    
    if (lastRequest && (now - lastRequest) < 30000) {
      return res.status(429).json({
        success: false,
        message: 'Aguarde 30 segundos antes de solicitar um novo código'
      });
    }

    recentRequests.set(email, now);

    // Verificar se o usuário existe
    const user = await db.User.findOne({ where: { email } });
    
    if (!user) {
      return res.json({
        success: true,
        message: 'Se o email existir, enviaremos um novo código'
      });
    }

    // Gerar novo código
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = now + 900000; // 15 minutos

    // Atualizar código no cache
    recoveryCodes.set(email, {
      code: recoveryCode,
      expires: codeExpiry,
      userId: user.id
    });

    // Enviar email
    await sendPasswordRecoveryEmail(email, recoveryCode);

    res.json({
      success: true,
      message: 'Novo código enviado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao reenviar código:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao reenviar código'
    });
  }
};
