const passport = require('passport');
const config = require('../helpers/settings.helper');

const authenticate = (req, res, next) => {
  
  console.log(`[Auth] Attempt at ${new Date().toISOString()} from ${req.ip}`);
  
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    
    console.log(`[Auth] Result: ${user ? 'SUCCESS' : 'FAILED'}`);

    if (config.auth.debugMode) {
      
      console.debug('\n=== DEBUG AUTH INFORMATION ===');
      console.debug('Timestamp:', new Date().toISOString());
      console.debug('Client IP:', req.ip);
      console.debug('Request Path:', req.path);
      console.debug('Headers:', {
        ...req.headers,
        authorization: req.headers.authorization 
          ? `Bearer ***${req.headers.authorization.length - 7} chars` 
          : 'none'
      });

      if (err) {
        console.debug('Error Stack:', err.stack || 'No stack available');
      }

      console.debug('Passport Info:', {
        ...info,
        message: info?.message,
        name: info?.name
      });
      console.debug('User:', user ? { id: user.id } : 'none');
      console.debug('==============================\n');
    }

    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized',
        ...(config.auth.debugMode && {
          debugInfo: {
            reason: info?.message,
            client: req.ip,
            timestamp: new Date().toISOString()
          }
        })
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};


module.exports = authenticate;