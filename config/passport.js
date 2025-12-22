const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User, Role } = require("../models");

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
  jwtFromRequest: unifiedJwtExtractor,
  secretOrKey: process.env.JWT_SECRET,
  //passReqToCallback: true
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findByPk(jwt_payload.id, {
          include: [
            {
              model: Role,
              as: "roles",
              attributes: ["id", "name", "slug"],
            },
          ],
        });

        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
