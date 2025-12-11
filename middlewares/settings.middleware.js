function injectSettings(req, res, next) {
  try {
    
    req.settings = global.settings || {};

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = injectSettings;
