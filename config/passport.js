const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('../helpers/db.helper');
const jwt = require('jsonwebtoken');

// Função personalizada para extrair o token do cookie
const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await db.User.findByPk(jwt_payload.id, {
        include: db.Role
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }

    } catch (err) {
      return done(err, false);
    }
  }));
};
