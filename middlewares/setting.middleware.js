
const settingsHelper = require('../helpers/settings.helper');

async function loadSettings(req, res, next) {
  try {
    const setting = await settingsHelper.getSettingsByPrefix('uploadRequired');
    req.isUploadRequired = setting ? setting.uploadRequired.value === "true" : true;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = loadSettings;
