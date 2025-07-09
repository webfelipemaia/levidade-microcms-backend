const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../helpers/db.helper");

exports.login = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email} });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new db.User({
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  console.log(req.headers.authorization?.replace('Bearer ', ''));
  try {
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) return res.status(401).json({ message: 'Token not supplied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ 
        message: 'Invalid token: Payload does not contain user id',
        solution: 'Check the token generation in the login'
      });
    }

    const user = await db.User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
      raw: true
    });

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        
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
    
    console.error('getMe Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};