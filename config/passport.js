const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('../helpers/db.helper');

/**
 * Extrator unificado:
 * 1. Bearer Token (mobile / API)
 * 2. Cookie 'jwt' (web)
 */
const unifiedJwtExtractor = function (req) {

  //Debug
  //console.log("Extractor :: cookies:", req.cookies);
  //console.log("Extractor :: header:", req.headers.authorization);

  // 1. Bearer Authorization Header (Mobile)
  const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (tokenFromHeader) return tokenFromHeader;

  // 2. Cookies (Web)
  if (req && req.cookies) {
    if (req.cookies.jwt) return req.cookies.jwt;
    if (req.cookies.token) return req.cookies.token;
  }

  return null;
};


const opts = {
  jwtFromRequest: unifiedJwtExtractor, // Custom extractor
  secretOrKey: process.env.JWT_SECRET, // JWT Secret
  //passReqToCallback: true // Add req at callback
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      db.User.findByPk(jwt_payload.id, { include: db.Role })
        .then(user => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch(err => done(err, false));
    })
  );
  
};

